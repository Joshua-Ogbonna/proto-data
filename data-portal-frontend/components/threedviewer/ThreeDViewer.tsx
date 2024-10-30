"use client"

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'

function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath)
  return <primitive object={scene} />
}

function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <p>Error loading 3D model. Please try again later.</p>
    </div>
  )
}

export default function ThreeDViewer({ modelPath }: { modelPath: string }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Model modelPath={modelPath} />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  )
}