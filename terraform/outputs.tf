output "vpc_id" {
  description = "The ID of the provisioned VPC"
  value       = aws_vpc.devops_vpc.id
}

output "subnet_id" {
  description = "Public subnet ID"
  value       = aws_subnet.public_subnet.id
}

output "security_group_id" {
  description = "Web security group ID"
  value       = aws_security_group.web_sg.id
}

