output "public_ip" {
  value = aws_eip.lb.public_ip
}

output "public_dns" {
  value = aws_instance.server.public_dns
}
