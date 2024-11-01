output "public_ip" {
  value = aws_eip.lb.public_ip
}

output "public_dns" {
  value = aws_instance.server.public_dns
}

output "private_key" {
  value = tls_private_key.ssh_server_key.private_key_openssh
  sensitive = true
}

