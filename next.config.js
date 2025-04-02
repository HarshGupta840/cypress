/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "wbvseupoejivsyamqnly.supabase.co",
            }
        ]
    }
}

module.exports = nextConfig
