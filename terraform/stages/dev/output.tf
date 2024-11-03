output "public_ip" {
  value = module.aws_setup.public_ip
}

output "public_dns" {
  value = module.aws_setup.public_dns
}

output "private_key" {
  value     = tls_private_key.ssh_server_key.private_key_openssh
  sensitive = true
}

