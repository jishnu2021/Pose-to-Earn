import React from 'react'
import img from '../images/img.png'
import Card from './Card'
import Cards from './Cards'

const Task = () => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
  <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
    <h2 className="mb-4 mt-8 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
    Daily Fitness Quests: Level Up Your Routine!
    </h2>
    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
    Embark on your fitness journey with our daily quests designed to challenge and motivate you. Whether you're aiming for strength, endurance, or overall wellness, each quest offers a fresh challenge
    </p>
  </div>
  <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0" />
</section>

    <Cards/>
    <Card/>
    <Cards/>
    </>
  )
}

export default Task


