<template>
  <div>
      <div class="custom-hero">
          <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">About Me</h1>
          <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
          <h1 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">My name is Nicolas, I am a Data and AI Enthusiast from Munich, Germany.</h1>
      </div>
      <div class="max-w-screen-lg flex flex-col justify-between mx-auto p-4 column mb-4">
        <div class="flex 2xm:flex-row xl:flex-row lg:flex-row md:flex-row flex-col items-center mb-8">
          <div class="lg:w-1/5 md:w-1/5 sm:w-1/2 me-8 sm:mb-4">
            <img class="rounded-full" src="https://media.licdn.com/dms/image/D5603AQG2VQT_-XU17A/profile-displayphoto-shrink_800_800/0/1633939892232?e=1717027200&v=beta&t=fn6hX3gVla0yK2mAmG4o3QxetIatC3r2yWRp6qccR6Q" alt="image description">
          </div>
          <div class="text-lg lg:w-4/5 md:w-4/5 sm:w-1/2">
            I've always been drawn to the world of data. During my computer science studies at the Technical University of Munich, I focused on databases and machine learning. My experiences at E.ON and Amazon further sharpened my abilities in SQL and Python, and introduced me to the fascinating realm of serverless architecture. Currently, I'm expanding my toolkit with Rust, Docker, Kubernetes, mastering the art of building efficient CI/CD pipelines, and diving into unit testing. To me, the ability to learn and grow through acquiring new skills is the best opportunity an employer can provide. Outside of work, I'm actively involved in the Munich data science scene, enjoy participating in hackathons, and am passionate about entrepreneurship.
          </div>
        </div>
        <h2 class="mt-10 text-3xl text-gray-900 dark:text-white">Curriculum Vitae</h2>
        <hr class="w-24 h-0.5 bg-gray-600 border-0 rounded my-4 mb-8">
        <ol class="relative border-s border-emerald-600 dark:border-gray-700">                  
            <li class="mb-8 ms-4">
                <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Since Sepember 2023</time>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">AI Engineer at BCG X</h3>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400">
                  <ul class="list-disc px-4">
                    <li>Build Gen AI Usecases using Vector Databases, Langchain, AWS and LLM function calling.</li>
                  </ul>
                </p>
            </li>
            <li class="mb-8 ms-4">
                <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">October 2022 - Mai 2023</time>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Master Thesis on Federated Learning</h3>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400"><ul class="list-disc px-4">
                  <li>Conducted Experiments on Fairness in Client Selection Algorithms in Federated Learning Systems</li>
                </ul></p>
            </li>
            <li class="mb-8 ms-4">
                <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022 - September 2022</time>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Software Engineer at BCG GAMMA</h3>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400"><ul class="list-disc px-4">
                  <li>Build an MLOps Pipeline for an internal python library. Comprised of unit and integration tests, test coverage reports, linting, formatting, pre-commit hooks, a CI/CD pipeline, and automatic documentation with Sphinx and GitHub pages</li>
                  <li>Developed a run versioning system for Machine learning applications. In generated run folders, a run's configuration files, log files, and output files are saved. This allows the user to reproduce past runs deterministically</li>
                </ul></p>
            </li>
            <li class="mb-8 ms-4">
                <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">October 2021 - March 2022</time>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Analyst at Amazon Pay</h3>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400"><ul class="list-disc px-4">
                  <li>Built, updated and deployed ETL workflows that automatically pull and update relevant KYC/Compliance data for the sales team in quick view dashboards. Hereby, demonstrated high level of frugality and reduced weekly time spent on recurring work for sales representatives by 70%</li>
                  <li>Conducted an exploratory churn rate analysis to identify correlations between churn rate and other KPIs, using SQL, Python, Pandas, scikit-learn and Matplotlib</li>
                </ul></p>
            </li>
            <li class="mb-8 ms-4">
                <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2020 - September 2021</time>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Engineer at E.ON</h3>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400"><ul class="list-disc px-4">
                  <li>Enabled real-time data processing using Kafka, which reduced data loading times from 2 days (batch mode) to a few minutes</li>
                  <li>Established a scalable MLOps framework for the data science department</li>
                </ul></p>
            </li>
            <li class="ms-4">
                <div class="absolute w-3 h-3 bg-emerald-200 rounded-full mt-1.5 -start-1.5 border border-emerald-600 dark:border-gray-900 dark:bg-gray-700"></div>
                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2017 - August 2019</time>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Data Science at Burda</h3>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400"><ul class="list-disc px-4">
                  <li>Merged gigabytes of traffic and ad-revenue data to provide unprecedented transparency on revenue per click to management (using Spark, AWS, EMR, Sagemaker)</li>
                  <li>Implemented a personalization algorithm into focus.de which provides a tailored user experience for more than 25M users (DynamoDB, Lambda, Python)</li>
                </ul></p>
            </li>
        </ol>
        
      </div>
    </div>
</template>