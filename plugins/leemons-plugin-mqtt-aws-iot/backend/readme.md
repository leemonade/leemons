We need one region and credentials of one user with permissions to 

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iot:Connect",
                "iot:Subscribe",
                "iot:Publish",
                "iot:Receive",
                "iot:DescribeEndpoint",
                "sts:GetFederationToken"
            ],
            "Resource": "*"
        }
    ]
}