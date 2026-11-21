terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# -------------------------------------------------------------
# 1. Virtual Private Cloud (VPC)
# -------------------------------------------------------------
resource "aws_vpc" "devops_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "devopsforge-vpc"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# -------------------------------------------------------------
# 2. Public Subnet for Ingress / Load Balancers
# -------------------------------------------------------------
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.devops_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"

  tags = {
    Name = "devopsforge-public-subnet"
  }
}

# -------------------------------------------------------------
# 3. Internet Gateway
# -------------------------------------------------------------
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.devops_vpc.id

  tags = {
    Name = "devopsforge-igw"
  }
}

# -------------------------------------------------------------
# 4. Security Group (Firewall rules)
# -------------------------------------------------------------
resource "aws_security_group" "web_sg" {
  name        = "devopsforge-web-sg"
  description = "Allow HTTP, HTTPS, and SSH inbound"
  vpc_id      = aws_vpc.devops_vpc.id

  ingress {
    description = "HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Application port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "devopsforge-sg"
  }
}

