/** @type {import('next').NextConfig} */

const { dependencies } = require('./package.json')

// init
const transpilePackages = Object
  .keys(dependencies)
  .filter((dependency) => dependency.includes('@s/'))

// main
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages
}

// export
module.exports = nextConfig
