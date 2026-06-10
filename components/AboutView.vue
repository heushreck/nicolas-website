<template>
    <div>
        <div class="about-container">
            <div class="image-text-container">
                <div class="image">
                    <img src="/images/profile_picture2.jpg" alt="Nicolas Neudeck">
                </div>
                <div class="text">
                    <p>I'm an AI engineer focused on building agentic systems and the infrastructure that runs them. Over the past decade — at E.ON, Amazon, BCG X, and most recently as a founding engineer at superglue — I've worked across the stack on real-time data pipelines, GenAI applications at scale, and cloud architecture supporting millions of requests. From June 2026, I'm joining Sierra to build conversational AI agents. I care about scalable systems, code quality, and shipping software that holds up under real-world load. Outside of work, I'm part of the Munich data science community, enjoy hackathons, and am drawn to entrepreneurship.</p>
                </div>
            </div>
            <h2 class="heading">Curriculum Vitae</h2>
            <hr class="hr-line">
            <ol class="ordered-list">
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">Starting June 2026</time>
                    <h3 class="h3">Member of Technical Staff at Sierra</h3>
                    <ul class="ul">
                        <li>Building conversational AI agents.</li>
                        <li>Joining as Sierra's first German hire to help build out the Munich office and partner with GTM across DACH.</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">September 2025 - June 2026</time>
                    <h3 class="h3">Founding Engineer at superglue (YC W25)</h3>
                    <ul class="ul">
                        <li>Building an AI-powered integration platform that lets enterprises connect business systems in minutes instead of months.</li>
                        <li>Fourth hire; helped shape the <a href="https://superglue.ai/" target="_blank">product</a> from the early days.</li>
                        <li>Own the cloud architecture and scaling of the platform, supporting thousands of users and millions of requests. Lead architectural decisions, performance evaluations, and benchmarking of our GenAI backend to push state-of-the-art capabilities.</li>
                        <li>Active across sales calls, product demos, and client POCs — bridging AI engineering, product, solution architecture, and on-prem deployments. Led the rollout at our largest customer and helped close the deal.</li>
                        <li>Beyond engineering: lead hiring and interviewing, and mentor interns and other engineers.</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">September 2023 - August 2025</time>
                    <h3 class="h3">AI Engineer at BCG X</h3>
                    <ul class="ul">
                        <li>Developed several GenAI use cases using Python, AWS (Lambda, ECS, RDS), GCP, and LangChain (e.g., platform to compare proposals). Built a RAG Output Quality Framework and enhanced product performance and efficiency.</li>
                        <li>Acted as technical lead on client-facing AI engagements; steered delivery teams, coordinated with client developers and architects, and briefed senior business stakeholders on progress, trade-offs, and roadmap.</li>
                        <li>Developed scalable real-time AI applications for CallCenters with AWS (Kinesis, Bedrock, Sagemaker), including real-time audio transcription, data streaming and automated cross-region deployments, handling 2000+ LLM requests/min.</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">October 2022 - Mai 2023</time>
                    <h3 class="h3">Master Thesis on Federated Learning</h3>
                    <ul class="ul">
                    <li>Conducted Experiments on Fairness in Client Selection Algorithms in Federated Learning Systems</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">April 2022 - September 2022</time>
                    <h3 class="h3">Software Engineer at BCG GAMMA</h3>
                    <ul class="ul">
                    <li>Build an MLOps Pipeline for an internal python library. Comprised of unit and integration tests, test coverage reports, linting, formatting, pre-commit hooks, a CI/CD pipeline, and automatic documentation with Sphinx and GitHub pages</li>
                    <li>Developed a run versioning system for Machine learning applications. In generated run folders, a run's configuration files, log files, and output files are saved. This allows the user to reproduce past runs deterministically</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">October 2021 - March 2022</time>
                    <h3 class="h3">Data Analyst at Amazon Pay</h3>
                    <ul class="ul">
                    <li>Built, updated and deployed ETL workflows that automatically pull and update relevant KYC/Compliance data for the sales team in quick view dashboards. Hereby, demonstrated high level of frugality and reduced weekly time spent on recurring work for sales representatives by 70%</li>
                    <li>Conducted an exploratory churn rate analysis to identify correlations between churn rate and other KPIs, using SQL, Python, Pandas, scikit-learn and Matplotlib</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">April 2020 - September 2021</time>
                    <h3 class="h3">Data Engineer at E.ON</h3>
                    <ul class="ul">
                    <li>Enabled real-time data processing using Kafka, which reduced data loading times from 2 days (batch mode) to a few minutes</li>
                    <li>Established a scalable MLOps framework for the data science department</li>
                    </ul>
                </li>
                <li class="list-item">
                    <div class="circle"></div>
                    <time class="time">March 2017 - August 2019</time>
                    <h3 class="h3">Data Science at Burda</h3>
                    <ul class="ul">
                    <li>Merged gigabytes of traffic and ad-revenue data to provide unprecedented transparency on revenue per click to management (using Spark, AWS, EMR, Sagemaker)</li>
                    <li>Implemented a personalization algorithm into focus.de which provides a tailored user experience for more than 25M users (DynamoDB, Lambda, Python)</li>
                    </ul>
                </li>
            </ol>

        </div>
    </div>
</template>

<style scoped>
.about-container {
    display: flex;
    padding: 2rem;
    margin: 0 auto;
    flex-direction: column;
    justify-content: space-between;
    max-width: 1200px;
}

.image-text-container {
    display: flex;
    margin-bottom: 3rem;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2rem 0;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-start;
        gap: 3rem;
    }
}

.image {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
        transform: scale(1.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
    }

    img:hover {
        transform: scale(1.3);
    }

    @media (min-width: 768px) {
        img {
            width: 150px;
            height: 150px;
        }
    }

    @media (min-width: 1024px) {
        img {
            width: 160px;
            height: 160px;
        }
    }
}

.text {
    flex: 1;
    font-size: 1.125rem;
    line-height: 1.8;
    text-align: left;
    color: #374151;

    p {
        margin: 0;
        padding: 0;
    }

    @media (min-width: 768px) {
        text-align: justify;
        padding-left: 1rem;
    }
}
.ordered-list {
    position: relative;
    border-inline-start-width: 1px;
    border-color: rgb(5 150 105);
    list-style: none;
    border-style: solid;
    border-width: 0px;
    border-left-width: 1px;
    box-sizing: border-box;
    padding: 0px;
}
.list-item {
    margin-bottom: 2rem;
    margin-inline-start: 1rem;
}
.circle {
    position: absolute;
    margin-top: 0.375rem;
    border-radius: 9999px;
    border-width: 1px;
    width: 0.75rem;
    height: 0.75rem;
    background-color: rgb(167 243 208);
    border-color: rgb(5 150 105);
    border-style: solid;
    inset-inline-start: -.375rem;
}

.time {
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
    line-height: 1;
    color: #70747b;
}

.h3 {
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: #111827;
}

.ul {
    padding-left: 1rem;
    padding-right: 1rem;
    list-style-type: disc;
}

.vp-doc h3 {
    margin: 0;
}

</style>
