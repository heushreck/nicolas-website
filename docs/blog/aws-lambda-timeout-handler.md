---
title: AWS Python Lambda Timeout Handler
description: Learn how to handle AWS Python Lambda timeouts effectively using a timeout handler to manage long-running processes and ensure seamless execution, even past the 15-minute limit.
head:
  - - meta
    - property: 'og:description'
      content: Learn how to handle AWS Python Lambda timeouts effectively using a timeout handler to manage long-running processes and ensure seamless execution, even past the 15-minute limit.
  - - meta
    - property: 'og:title'
      content: AWS Python Lambda Timeout Handler | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: https://lh3.googleusercontent.com/d/1rqALtXKJxWeXrQPnI5lNmYeSkVj87Ass
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/blog/aws-lambda-timeout-handler
  - - meta
    - property: keywords
      content: 'AWS, Lambda, Timeout, Serverless, Signal, Nicolas, Neudeck'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: AWS Python Lambda Timeout Handler | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: Learn how to handle AWS Python Lambda timeouts effectively using a timeout handler to manage long-running processes and ensure seamless execution, even past the 15-minute limit.
  - - meta
    - name: 'twitter:image'
      content: https://lh3.googleusercontent.com/d/1rqALtXKJxWeXrQPnI5lNmYeSkVj87Ass
  - - meta
    - name: 'twitter:site'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:creator'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:url'
      content: https://nicolasneudeck.com/blog/aws-lambda-timeout-handler
  - - meta
    - name: google-site-verification
      content: 9agtSktJYcUTkHEIMiXa-0GX5OAFp-aq-M-sGdHEDm8
---
<script setup>
import Hero from '../../components/Hero.vue'
import Share from '../../components/Share.vue'
const prettyDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
const empty_string = ""
const title = "AWS Python Lambda Timeout Handler"
const shortDescription = "Learn how to handle AWS Python Lambda timeouts effectively using a timeout handler to manage long-running processes and ensure seamless execution, even past the 15-minute limit."
const subtitle = "2024-08-02"
const tags = [
        "AWS",
        "Lambda",
        "Timeout",
        "Serverless",
        "Signal"
      ]
</script>
# AWS Python Lambda Timeout Handler
<Hero :title="empty_string" :subtitle="prettyDate(subtitle)"/>
<Share :title="title" :shortDescription="shortDescription" :tags="tags"/>

AWS Serverless functions are ideal for handling small tasks such as API calls, retrieving data from databases or S3, or calling an LLM and returning the response. However, challenges arise when tasks take longer than expected due to processes running longer or encountering exceptions that do not terminate the lambda.

In such scenarios, the lambda may run into a timeout. By default, AWS Lambda functions have a timeout of 3 seconds, extendable up to 15 minutes. When a lambda times out, it restarts with the same initial event (unless disabled), which may be beneficial for resolving temporary issues but problematic for inherently lengthy operations.

## Problem Scenario

Consider a scenario where we need to calculate a specific prime number and store it in a database. Below is an example code to find a prime number at a specific position:

```python
def find_exact_prime_number_at_position(position: int, start_prime: int = 2, start_counter: int = 0):
    counter = start_counter
    prime = start_prime
    while counter < position:
        prime += 1
        if is_prime(prime):
            counter += 1
    return prime

def is_prime(number: int):
    if number < 2:
        return False
    for i in range(2, int(number ** 0.5) + 1):
        if number % i == 0:
            return False
    return True
```

Our lambda function could call this function with the user input position of the prime number like this:

```python
def lambda_handler(event, context):
    position = event["position"]
    answer = find_exact_prime_number_at_position(position)
    # store answer in database
    return {"status": 200}
```

If our lambda function gets a position as input, it can store the associated prime number in a database reliably. However, calculating the 10,000th prime number would take around 2 minutes, which exceeds a 3-second lambda timeout. The solution for this would be to adjust the lambda settings and up the timeout to lets say 5 mimutes. But what if somebody want even higher prime numbers?

## Solution: Timeout Handler

To handle this, we introduce a timeout catcher that intercepts the lambda timeout before it occurs, allowing the lambda to restart with an updated state and continue processing. Here’s how it’s implemented:

### Lambda Timeout Handler Implementation

```python
import json
import os
import signal
import boto3

# Global variables to store the latest prime number and the counter
latest_prime = 2
latest_counter = 0

def timeout_handler(_signal, _frame):
    print("Timeout Handler!")   
    payload = {
        "latest_prime": latest_prime,
        "latest_counter": latest_counter,
        "position": position,
    }
    client = boto3.client("lambda")
    client.invoke_async(
        FunctionName=os.environ["LAMBDA_ARN"],
        InvokeArgs=json.dumps(payload),
    )
    print("Invoked Lambda Async!")
    return {
        "statusCode": 200,
        "body": json.dumps("Invoked Lambda Async!"),
    }

signal.signal(signal.SIGALRM, timeout_handler)

def lambda_handler(event, context):
    print("Received event: %s" % json.dumps(event))

    global latest_prime
    latest_prime = event.get("latest_prime", 2)
    global latest_counter
    latest_counter = event.get("latest_counter", 0)
    global position
    position = event.get("position", 10000)

    # The timeout is set to 15 seconds less than the remaining time
    timeout = int(context.get_remaining_time_in_millis() / 1000) - 15
    signal.alarm(timeout)
    try:
        prime_number_we_search = find_exact_prime_number_at_position(position, latest_prime, latest_counter)
        # Store the prime number in the database
        print(f"Latest Prime: {prime_number_we_search}")
        # Disable the alarm
        signal.alarm(0)
    except Exception as e:
        print(f"Error: {e}")
        return {"statusCode": 500, "body": json.dumps("Error!")}
    return {"statusCode": 200, "body": json.dumps("Function finished!")}
```

By using the `signal` package, we set handlers for asynchronous events. The timeout is set to 15 seconds before the actual lambda timeout, giving ample time to catch and handle the timeout by invoking the lambda again with updated state, effectively resetting the timeout. We update the state by reading the global variables and passing them to the new invokation of the lambda

### Updated Prime Number Function

The prime number find function needs to update our global variables with every prime number it finds

```python
def find_exact_prime_number_at_position(position: int, start_prime: int = 2, start_counter: int = 0):
    global latest_prime, latest_counter # [!code focus]
    counter = start_counter
    prime = start_prime
    while counter < position:
        prime += 1
        if is_prime(prime):
            latest_prime = prime # [!code focus]
            counter += 1
            latest_counter = counter # [!code focus]
    return prime
```


## Considerations

- **Asynchronous Lambdas:** This approach is suitable only for lambdas called asynchronously, where a response is not expected by the caller, such as lambdas that call an LLM and store the result in a database for frontend access.
- **Main Event Loop:** The signal handler can only be started in the main event loop of the python process. The lambda will not terminate if threads are still running.