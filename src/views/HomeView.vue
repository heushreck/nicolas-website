<template>
  <div class="custom-hero">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Nicolas Neudeck</h1>
    <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
    <h1 class="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-4xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">AI</span> Engineer</h1>
  </div>
  <div class="max-w-screen-lg flex flex-col justify-between mx-auto p-4">
    <div>Hello</div>
    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">My current Interests</h2>
    <FlowbiteAccordion :open-first-item="false" class="w-full">
      <FwbAccordionPanel v-for="(item, index) in accordionItems" :key="index">
        <FwbAccordionHeader :class="item.headerClass">
          <div class="flex flex-row">
            <div v-html="item.headerIcon"></div>
            <div>{{ item.headerText }}</div>
          </div>
        </FwbAccordionHeader>
        <FwbAccordionContent>
          <div>
            <p v-for="(paragraph, pIndex) in item.content" :key="pIndex" class="mb-2 text-gray-500 dark:text-gray-400">
              {{ paragraph.text }}
            </p>
          </div>
        </FwbAccordionContent>
      </FwbAccordionPanel>
    </FlowbiteAccordion>
  </div>
</template>

<script setup>
import FlowbiteAccordion from '../components/FwbAccordion/FwbAccordion.vue'
import FwbAccordionPanel from '../components/FwbAccordion/FwbAccordionPanel.vue'
import FwbAccordionHeader from '../components/FwbAccordion/FwbAccordionHeader.vue'
import FwbAccordionContent from '../components/FwbAccordion/FwbAccordionContent.vue'
import accordionItems from '../data/home/interests.json';
</script>