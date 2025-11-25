/** @type {import('next').NextConfig} */

const nextConfig = {
     experimental: {
    inlineCss: true,
    useCache: true
  },
    images: {
        domains : [
            "res.cloudinary.com",
            "lh3.googleusercontent.com"
        ]
    }
}

module.exports = nextConfig