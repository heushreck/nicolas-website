---
title: Building a GenAI-powered Excel Add-in
description: In Part 3 of the tutorial, learn how to build and integrate a backend server using FastAPI and Python, and connect them to our Frontend.
head:
  - - meta
    - property: 'og:description'
      content: In Part 3 of the tutorial, learn how to build and integrate a backend server using FastAPI and Python, and connect them to our Frontend.
  - - meta
    - property: 'og:title'
      content: Building a GenAI-powered Excel Add-in | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: /images/genai-powered-excel-add-in-03.webp
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/blog/genai-powered-excel-add-in-03
  - - meta
    - property: keywords
      content: 'Vue.js, Office Add-In, GenAI, FastAPI, Nicolas, Neudeck'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: Building a GenAI-powered Excel Add-in | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: In Part 3 of the tutorial, learn how to build and integrate a backend server using FastAPI and Python, and connect them to our Frontend.
  - - meta
    - name: 'twitter:image'
      content: /images/genai-powered-excel-add-in-03.webp
  - - meta
    - name: 'twitter:site'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:creator'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:url'
      content: https://nicolasneudeck.com/blog/genai-powered-excel-add-in-03
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
const title = "Creating a GenAI-Powered Excel Add-In - Part 03 - Backend Integration"
const shortDescription = "In Part 3 of the tutorial, learn how to build and integrate a backend server using FastAPI and Python, and connect them to our Frontend."
const subtitle = "2024-05-10"
const tags = [
        "Vue.js",
        "Office Add-In",
        "GenAI",
        "Excel",
        "Graphs",
        "FastAPI"
      ]
</script>
# Creating a GenAI-Powered Excel Add-In - Part 03 - Backend Integration
<Hero :title="empty_string" :subtitle="prettyDate(subtitle)"/>
<Share :title="title" :shortDescription="shortDescription" :tags="tags"/>

Welcome to Part 3 of our tutorial series on developing a GenAI-powered Excel Add-In to dynamically create charts from your data. If you haven't already, make sure to read the [previous tutorial](https://nicolasneudeck.com/blog/genai-powered-excel-add-in-02) to ensure you're ready to proceed with this installment.

In this segment, we focus on constructing the backend and linking it to our Vue.js frontend through a REST API.

### What We'll Use

- **FastAPI and Python** for the backend.
- **OpenAI’s GPT Model** to interpret user intent and suggest appropriate charts.

## Prerequisites

Before we begin, you should:
- Complete the frontend setup from the [last tutorial](https://nicolasneudeck.com/blog/genai-powered-excel-add-in-02).
- Obtain an OpenAI API key, available [here](https://platform.openai.com/docs/quickstart?context=python).
- Have Python 3.10 or higher installed with pip.

## Setup

1. **Prepare your environment:**
   - Create a new directory called `api`.
   - Navigate (`cd`) into the `api` directory via your terminal.
   - Create a `requirements.txt` file with the following contents:
     ```
     fastapi[all]
     openai
     instructor
     ```

2. **Set up a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

## Building the FastAPI Server

We aim to develop a backend that offers an endpoint for the frontend to access. This endpoint will process the user's intent and selected data, returning the necessary chart metadata.

### Step-by-Step Guide:

1. **Initialize your server:**
   
   - Create `main.py` and import necessary modules.
   - Set up CORS to allow cross-origin requests for local testing.

    ```python
    from fastapi import FastAPI, CORSMiddleware
    from pydantic import BaseModel, Field
    from enum import Enum
    from openai import OpenAI
    import instructor
    import os

    app = FastAPI()
    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```

2. **Define data models:**
  
    Define data models to specify what information the API receives and how it responds. We are using Pydantic `BaseModels` as our data structure because they integrate seamlessly with FastAPI and the Instructor Library for our LLM interactions.

    ```python
    class ChartType(str, Enum):
        Line = "Line"
        Doughnut = "Doughnut"
        ColumnClustered = "ColumnClustered"
        Waterfall = "Waterfall"
        XYScatter = "XYScatter"

    class ChartData(BaseModel):
        title: str = Field(..., description="The title of the chart")
        x_axis_label: str = Field(..., description="The label for the x-axis")
        y_axis_label: str = Field(..., description="The label for the y-axis")
        chart_type: ChartType = Field(..., description="The type of chart")
        has_trendline: bool = Field(..., description="Whether the chart should have a trendline")

    class ChartInputData(BaseModel):
        intention: str
        data: list
    ```

3. **Create the API endpoint:**

    Implement a POST endpoint that maps requests to `ChartInputData` and returns `ChartData`.

    ```python
    @app.post('/graph-data')
    async def get_graph_data(chart_input_data: ChartInputData) -> ChartData:
        return call_llm(chart_input_data)
    ```

4. **Integrate the LLM:**
   
    Define a function to call the LLM. This function initializes an LLM client from OpenAI and integrates it with the instructor library. The instructor library configures the LLM to output data in a structured format, specifically a `ChartData` model, rather than the usual text. This model includes fields for the chart title, axis names, and one of five chart types. On line 6, we define our output model, the `ChartData`, with detailed descriptions for each field. Now, when the `client.chat.completions.create` method is called, the output from OpenAI is mapped to this `ChartData` class, which we can then return.

    ```python:line-numbers
    def call_llm(input: ChartInputData) -> ChartData:
        try:
            client = instructor.from_openai(OpenAI())
            llm_response_model = client.chat.completions.create(
                model="gpt-3.5-turbo",
                response_model=ChartData,
                messages=[
                    {"role": "system", "content": "You are a talented data scientist."},
                    {"role": "user", "content": "I need a chart that effectively represents my data based on {input.intention}. Here is the data: {input.data}."}
                ]
            )
        except Exception as e:
            print(f"An error occurred: {e}")
            llm_response_model = ChartData(title="Error", x_axis_label="Error", y_axis_label="Error", chart_type=ChartType.Line, has_trendline=True)
        return llm_response_model
    ```

5. **Launch the server:**
   - Start your FastAPI server using Uvicorn with hot reload enabled.
   ```bash
   uvicorn main:app --reload
   ```
   - Verify your API by navigating to `http://localhost:8000/docs` in your browser and checking out the OpenAPI Specs documentation

## Integrating with the Frontend

Since the frontend was configured in the previous tutorial to dynamically generate the graph based on the `chartData` variable, updating this variable with the API call's output will seamlessly integrate the changes.

To make an API call in Vue.js, we will use the Vue.js fetch function.

### Modify the Code

In the `App.vue` file within the frontend folder, directly below the `chartData` variable, create a function that calls our API and assigns the returned result to `chartData`.

```jsx
let chartData = {...}

const fetchData = async (data) => {
  const requestParams = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ intention: intention.value, data: data}),
  };
  await fetch('http://localhost:8000/graph-data', requestParams)
  .then(response => response.json())
  .then(data => chartData = data);
}
```

Within our createChart function, we now have the capability to invoke our fetchData function.

```jsx
const range = context.workbook.getSelectedRange();
range.load("valuesAsJsonLocal");  // [!code focus]
await context.sync();  // [!code focus]
const data_input = range.valuesAsJsonLocal.map(item => item.map(subItem => subItem.basicValue));  // [!code focus]
await fetchData(data_input);  // [!code focus]
const sheet = context.workbook.worksheets.getActiveWorksheet();
```

This section of code retrieves the range of cells selected by the user and loads them into the context. After refining the data to remove extraneous information, it's passed to the fetchData function. This function then updates the chartData dictionary with the new data, which is subsequently used to generate the plot.


## Testing Your Setup

Refresh your Excel add-in, input your intention, highlight some data and watch as the LLM suggests and generates a graph based on your specifications. If your intention was about showing potential profits, the LLM returns a Line graph, if talked about the data beeing X percentage of something bigger, the LLM will return a Doughnut graph.

## Looking Ahead

Stay tuned for the next tutorial where we will dockerize and deploy our application to the cloud.

## Additional Resources

- [FastAPI Official Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Completed Project on GitHub](https://github.com/heushreck/PlotPilot)