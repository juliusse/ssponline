resource "tls_private_key" "ssh_server_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "aws_server_key" {
  key_name   = "${var.app_name}-${var.stage}-server-key"
  public_key = tls_private_key.ssh_server_key.public_key_openssh
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
  count      = length(var.public_subnet_cidrs)
  vpc_id     = aws_vpc.vpc.id
  cidr_block = element(var.public_subnet_cidrs, count.index)
  availability_zone = element(var.azs, count.index)

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.app_name}-${var.stage}-public-${count.index}"
  }
}

resource "aws_subnet" "private_subnets" {
  count      = length(var.private_subnet_cidrs)
  vpc_id     = aws_vpc.vpc.id
  cidr_block = element(var.private_subnet_cidrs, count.index)
  availability_zone = element(var.azs, count.index)

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
  count = length(var.public_subnet_cidrs)
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
    source="./resources/setup-server.sh"
    destination="/tmp/setup-server.sh"
  }

  provisioner "file" {
    source="../deployment"
    destination="/home/ubuntu/deployment"
  }

  provisioner "file" {
    source="../certs"
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
    private_key = tls_private_key.ssh_server_key.private_key_pem
    timeout     = "4m"
  }
}

resource "aws_eip" "lb" {
  instance = aws_instance.server.id
  domain   = "vpc"
}

resource "github_actions_secret" "ssponline_aws_ssh_key" {
  repository       = "ssponline"
  secret_name      = "AWS_SSH_KEY"
  plaintext_value = tls_private_key.ssh_server_key.private_key_pem
}

resource "github_actions_secret" "ssponline_aws_ssh_ip" {
  repository       = "ssponline"
  secret_name      = "AWS_SSH_IP"
  plaintext_value = aws_eip.lb.public_ip
}

resource "github_actions_secret" "ssponline_aws_ssh_user" {
  repository       = "ssponline"
  secret_name      = "AWS_SSH_USER_NAME"
  plaintext_value = "ubuntu"
}

resource "github_actions_secret" "ssponline_aws_ssh_user_home" {
  repository       = "ssponline"
  secret_name      = "AWS_SSH_USER_HOME"
  plaintext_value = "/home/ubuntu"
}
