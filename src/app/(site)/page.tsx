import { ProfileRepository } from '@/lib/repositories/profile'
import { TypographyHero } from '@/components/sections/TypographyHero'
import { FeaturedWorks, FeaturedWorksSkeleton } from './_components/FeaturedWorks'
import { LatestNews, LatestNewsSkeleton } from './_components/LatestNews'
import { Suspense } from 'react'

export const metadata = {
  title: 'Portfolio - Home',
  description: 'Personal portfolio and works.',
}

export default async function HomePage() {
  // Only fetch critical Profile data for Hero
  const [profile, links] = await Promise.all([
    ProfileRepository.getProfile(),
    ProfileRepository.getLinks()
  ])

  return (
    <main className="min-h-screen">
      {/* Hero Section (Typography Orchestra) */}
      <TypographyHero profile={profile} links={links} />

      {/* Featured Works with Skeleton */}
      <Suspense fallback={<FeaturedWorksSkeleton />}>
        <FeaturedWorks />
      </Suspense>

      {/* News & Updates with Skeleton */}
      <Suspense fallback={<LatestNewsSkeleton />}>
        <LatestNews />
      </Suspense>
    </main>
  )
}
