data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  owners = ["amazon"]
}

data "aws_availability_zones" "available" {}
