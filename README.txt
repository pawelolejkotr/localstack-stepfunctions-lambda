1. register your account at localstack https://app.localstack.cloud
start trial (14 days)

follow geting started - 
download aws cli

[not required] download localstack cli
[not required] configure auth token 
localstack auth set-token <token from localstack getting started page>

@@@@@ LINUX bash @@@@@ 

export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export AWS_DEFAULT_REGION="us-east-1"

zip function.zip tr-lambda-fun.js

@@@@@ LINUX bash @@@@@ 



@@@@@ WINDOWS powershell@@@@@ 

$env:AWS_ACCESS_KEY_ID="test"
$env:AWS_SECRET_ACCESS_KEY="test"
$env:AWS_DEFAULT_REGION="us-east-1"
Compress-Archive -Path tr-lambda-fun.js -DestinationPath function.zip -Force

@@@@@ WINDOWS powershell @@@@@ 


2.
﻿docker run -d --name MyLocalstackContainer-p 4566:4566 -v /var/run/docker.sock:/var/run/docker.sock localstack/localstack

aws --endpoint-url=http://localhost:4566 lambda delete-function --function-name gto-logic
aws --endpoint-url=http://localhost:4566 lambda create-function --function-name gto-logic --runtime nodejs18.x --role arn:aws:iam::000000000000:role/lambda-role --handler tr-lambda-fun.handler --zip-file fileb://function.zip

aws --endpoint-url=http://localhost:4566 stepfunctions delete-state-machine --state-machine-arn arn:aws:states:us-east-1:000000000000:stateMachine:MyLocalStateMachine
aws --endpoint-url=http://localhost:4566 iam create-role --role-name MyStepFunctionsRole --assume-role-policy-document file://sfn_assume_role_policy.json --description "Dummy role for LocalStack Step Functions"
aws --endpoint-url=http://localhost:4566 stepfunctions create-state-machine --name MyLocalStateMachine --definition file://tr-step-functions.json --role-arn arn:aws:iam::000000000000:role/MyStepFunctionsRole --type STANDARD


example json to invoke step function
{
  "customer_tenant_system_name": "TenantTestowy",
  "chunk_size": 100,
  "type": "user",
  "execution_identification": "exec-12345",
  "tenant_identification": "tenant-abcde",
  "requested_by": "admin@firma.com"
}