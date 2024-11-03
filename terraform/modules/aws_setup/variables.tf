variable "region" {
  type        = string
  description = "AWS region for all resources."

  default = "eu-central-1"
}

variable "app_name" {
  type        = string
  description = "name of application"

  default = "ssponline"
}

variable "stage" {
  type        = string
  description = "The Stage of the deployment"
}

variable "ssh_public_key" {
    type        = string
    description = "SSH Public Key"
}

variable "ssh_private_key_pem" {
  type        = string
  description = "Private key for the server"
  sensitive = true
}

