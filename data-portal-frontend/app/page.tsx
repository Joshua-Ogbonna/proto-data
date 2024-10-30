import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Proto Data Portal</h1>
        <p className="text-xl text-gray-600 mb-6">
          Acquire, manage, and explore various types of data for your AI and mapping needs
        </p>
        <Button asChild size="lg">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          title="Labeled Datasets"
          description="Access high-quality labeled datasets for AI training and model development."
        />
        <FeatureCard
          title="HD Maps"
          description="Explore and acquire detailed HD maps for various regions and use cases."
        />
        <FeatureCard
          title="Raw Imagery"
          description="Get access to raw imagery data for your specific project needs."
        />
        <FeatureCard
          title="3D Scenes"
          description="Visualize and work with realistic 3D scenes for immersive applications."
        />
        <FeatureCard
          title="Point Clouds"
          description="Utilize point cloud data for 3D modeling and spatial analysis."
        />
        <FeatureCard
          title="Custom Tasks"
          description="Create tasks for custom data collection, labeling, and scene creation."
        />
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
        <Button asChild size="lg">
          <Link href="/signup">Sign Up Now</Link>
        </Button>
      </section>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}