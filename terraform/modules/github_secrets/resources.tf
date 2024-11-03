resource "github_actions_secret" "ssponline_aws_ssh_key" {
  repository      = "ssponline"
  secret_name     = "${upper(var.stage)}_AWS_SSH_KEY"
  plaintext_value = var.server_private_key_pem
}

resource "github_actions_secret" "ssponline_aws_ssh_ip" {
  repository      = "ssponline"
  secret_name     = "${upper(var.stage)}_AWS_SSH_IP"
  plaintext_value = var.server_public_ip
}

resource "github_actions_secret" "ssponline_aws_ssh_user" {
  repository      = "ssponline"
  secret_name     = "${upper(var.stage)}_AWS_SSH_USER_NAME"
  plaintext_value = "ubuntu"
}

resource "github_actions_secret" "ssponline_aws_ssh_user_home" {
  repository      = "ssponline"
  secret_name     = "${upper(var.stage)}_AWS_SSH_USER_HOME"
  plaintext_value = "/home/ubuntu"
}
