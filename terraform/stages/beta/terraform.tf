terraform {
  required_version = "~> 1.9"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.74.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
  backend "s3" {
    bucket  = "ssponline-tfstate"
    key     = "beta-state"
    region  = "eu-central-1"
    profile = "ssponline"
  }
}