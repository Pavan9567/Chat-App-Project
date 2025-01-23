def lambda_handler(event, context):
    num1 = event['num1']
    num2 = event['num2']
    return {"result": num1 + num2}
