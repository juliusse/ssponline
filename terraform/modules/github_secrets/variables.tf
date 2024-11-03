variable "stage" {
  type        = string
  description = "stage of the deployment"
}

variable "server_private_key_pem" {
  type        = string
  description = "Private key for the server"
  sensitive = true
}

variable "server_public_ip" {
  type        = string
  description = "Public IP of the server"
  sensitive = true
}