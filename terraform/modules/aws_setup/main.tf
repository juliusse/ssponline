locals {
  public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnet_cidrs = ["10.0.4.0/24", "10.0.5.0/24", "10.0.6.0/24"]
  azs = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
}

resource "aws_key_pair" "aws_server_key" {
  key_name   = "${var.app_name}-${var.stage}-server-key"
  public_key = var.ssh_public_key
}

resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.app_name}-${var.stage}-vpc"
  }
}

resource "aws_subnet" "public_subnets" {
  count      = length(local.public_subnet_cidrs)
  vpc_id     = aws_vpc.vpc.id
  cidr_block = element(local.public_subnet_cidrs, count.index)
  availability_zone = element(local.azs, count.index)

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-${var.stage}-public-${count.index}"
  }
}

resource "aws_subnet" "private_subnets" {
  count      = length(local.private_subnet_cidrs)
  vpc_id     = aws_vpc.vpc.id
  cidr_block = element(local.private_subnet_cidrs, count.index)
  availability_zone = element(local.azs, count.index)

  map_public_ip_on_launch = false
  tags = {
    Name = "${var.app_name}-${var.stage}-private-${count.index}"
  }
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "${var.app_name}-${var.stage}-public-route-table"
  }
}

resource "aws_route_table_association" "public_subnet_asso" {
  count = length(local.public_subnet_cidrs)
  subnet_id      = element(aws_subnet.public_subnets[*].id, count.index)
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "${var.app_name}-${var.stage}-gw"
  }
}

resource "aws_security_group" "security" {
  name = "allow-all"

  vpc_id = aws_vpc.vpc.id

  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 22
    to_port   = 22
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 80
    to_port   = 80
    protocol  = "tcp"
  }

  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-${var.stage}-security-group"
  }
}

resource "aws_instance" "server" {
  ami        = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.micro"
  key_name = aws_key_pair.aws_server_key.key_name
  vpc_security_group_ids = [aws_security_group.security.id]

  subnet_id = aws_subnet.public_subnets[0].id

  tags = {
    Name  = "${var.app_name}-${var.stage}-server"
  }

  provisioner "file" {
    source="../../modules/aws_setup/resources/setup-server.sh"
    destination="/tmp/setup-server.sh"
  }

  provisioner "file" {
    source="../../../deployment/${var.stage}"
    destination="/home/ubuntu/deployment"
  }

  provisioner "file" {
    source="../../../certs"
    destination="/home/ubuntu/certs"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo chmod +x /tmp/setup-server.sh",
      "sudo /tmp/setup-server.sh"
    ]
  }

  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ubuntu"
    private_key = var.ssh_private_key_pem
    timeout     = "4m"
  }
}

resource "aws_eip" "lb" {
  instance = aws_instance.server.id
  domain   = "vpc"
}
