import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const milestones = [
  // Fullstack
  { subject: 'fullstack', milestone: 'Understand how the web works (HTTP, DNS, browsers)' },
  { subject: 'fullstack', milestone: 'HTML & CSS fundamentals' },
  { subject: 'fullstack', milestone: 'JavaScript fundamentals (variables, functions, arrays, objects)' },
  { subject: 'fullstack', milestone: 'DOM manipulation with vanilla JS' },
  { subject: 'fullstack', milestone: 'Async JS (promises, async/await, fetch)' },
  { subject: 'fullstack', milestone: 'React fundamentals (components, props, state)' },
  { subject: 'fullstack', milestone: 'React hooks (useState, useEffect, useContext)' },
  { subject: 'fullstack', milestone: 'React Router for navigation' },
  { subject: 'fullstack', milestone: 'Node.js fundamentals (modules, fs, events)' },
  { subject: 'fullstack', milestone: 'Express.js (routing, middleware, REST APIs)' },
  { subject: 'fullstack', milestone: 'Databases (SQL basics, Prisma ORM)' },
  { subject: 'fullstack', milestone: 'Authentication (JWT, sessions, bcrypt)' },
  { subject: 'fullstack', milestone: 'Deploy a fullstack app (Vercel + Railway)' },

  // Networking
  { subject: 'networking', milestone: 'OSI model and TCP/IP stack' },
  { subject: 'networking', milestone: 'IP addressing and subnetting (IPv4)' },
  { subject: 'networking', milestone: 'Subnetting practice (CIDR notation)' },
  { subject: 'networking', milestone: 'VLANs and inter-VLAN routing' },
  { subject: 'networking', milestone: 'Routing protocols (static, RIP, OSPF)' },
  { subject: 'networking', milestone: 'Switching concepts (STP, EtherChannel)' },
  { subject: 'networking', milestone: 'NAT and PAT' },
  { subject: 'networking', milestone: 'WAN technologies and concepts' },
  { subject: 'networking', milestone: 'Network troubleshooting with CLI tools' },
  { subject: 'networking', milestone: 'CCNA exam preparation and practice tests' },

  // Cybersecurity
  { subject: 'cybersecurity', milestone: 'CIA Triad and core security concepts' },
  { subject: 'cybersecurity', milestone: 'Common attack types (phishing, MITM, SQL injection, XSS)' },
  { subject: 'cybersecurity', milestone: 'Linux fundamentals for security' },
  { subject: 'cybersecurity', milestone: 'Networking for security (firewalls, IDS/IPS)' },
  { subject: 'cybersecurity', milestone: 'Cryptography basics (symmetric, asymmetric, hashing)' },
  { subject: 'cybersecurity', milestone: 'Reconnaissance and scanning (nmap, Wireshark)' },
  { subject: 'cybersecurity', milestone: 'Web application security (OWASP Top 10)' },
  { subject: 'cybersecurity', milestone: 'Security frameworks (NIST, ISO 27001)' },
  { subject: 'cybersecurity', milestone: 'CompTIA Security+ preparation' },
]

async function main() {
  console.log('Seeding roadmap milestones...')

  for (const item of milestones) {
    await prisma.roadmap.create({ data: item })
  }

  console.log(`Seeded ${milestones.length} milestones successfully`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())