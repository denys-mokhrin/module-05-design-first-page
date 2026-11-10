import { course, openPractice } from "@/data/course"
import { CourseHeader } from "@/components/tracker/course-header"
import { NextUpQueue } from "@/components/tracker/next-up-queue"
import { ModuleGrid } from "@/components/tracker/module-grid"

export function App() {
  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-8 sm:py-12">
        <CourseHeader
          name={course.name}
          today={new Date()}
          lessons={course.lessons}
          practice={course.practice}
          behind={openPractice(course.modules)}
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <NextUpQueue items={course.queue} />
          <ModuleGrid modules={course.modules} />
        </div>
      </main>
    </div>
  )
}

export default App
