resource "tls_private_key" "ssh_server_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

module "aws_setup" {
  source              = "../../modules/aws_setup"
  stage               = "dev"
  ssh_public_key      = tls_private_key.ssh_server_key.public_key_openssh
  ssh_private_key_pem = tls_private_key.ssh_server_key.private_key_pem
}

module "github_secrets" {
  source                 = "../../modules/github_secrets"
  stage                  = "dev"
  server_private_key_pem = tls_private_key.ssh_server_key.private_key_pem
  server_public_ip       = module.aws_setup.public_ip
}