terraform {
  required_version = "~> 1.9"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.74.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.3"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
  backend "s3" {
    bucket = "ssponline-tfstate"
    key    = "dev-state"
    region = "eu-central-1"
    profile = "ssponline"
  }
}