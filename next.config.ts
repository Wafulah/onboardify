/** @type {import('next').NextConfig} */

const nextConfig = {
     experimental: {
    ppr: true,
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