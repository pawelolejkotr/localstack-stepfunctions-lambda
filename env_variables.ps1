docker run -d `
    --name MyLocalstackContainer `
    -p 4566:4566 `
    -v /var/run/docker.sock:/var/run/docker.sock `
    localstack/localstack

$env:AWS_ACCESS_KEY_ID="test"
$env:AWS_SECRET_ACCESS_KEY="test"
$env:AWS_DEFAULT_REGION="us-east-1"


aws --endpoint-url=http://localhost:4566 iam create-role `
    --role-name MyStepFunctionsRole `
    --assume-role-policy-document file://sfn_assume_role_policy.json `
    --description "Dummy role for LocalStack Step Functions"


aws --endpoint-url=http://localhost:4566 stepfunctions create-state-machine `
--name MyLocalStateMachine `
--definition file://state_machine.json `
--role-arn arn:aws:iam::000000000000:role/MyStepFunctionsRole `
--type STANDARD