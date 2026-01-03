import { Skill } from "./types";

export const AVAILABLE_SKILLS: Skill[] = [
  { category: "Networking", items: ["TCP/IP", "DNS", "VPN", "Subnetting", "Wireshark", "Packet Analysis"] },
  { category: "Linux", items: ["Bash Scripting", "Kali Linux", "File Permissions", "System Administration", "Process Management"] },
  { category: "Windows", items: ["PowerShell", "Registry", "SMB", "Active Directory", "Group Policy"] },
  { category: "Web Hacking", items: ["OWASP Top 10", "SQL Injection", "XSS", "Burp Suite", "API Testing"] },
  { category: "Active Directory", items: ["Kerberoasting", "BloodHound", "Pass-the-Hash", "LDAP", "Golden Ticket"] },
];

export const POPULAR_TOOLS = [
  "Nmap", "Burp Suite", "Metasploit", "Wireshark", "Nessus", "Hashcat", "John the Ripper", "Hydra", "Mimikatz", "BloodHound", "Cobalt Strike", "Ghidra"
];

export const BADGE_URLS: Record<string, string> = {
  "Nmap": "https://img.shields.io/badge/Nmap-Included-blue?logo=nmap&logoColor=white",
  "Burp Suite": "https://img.shields.io/badge/Burp%20Suite-Expert-orange?logo=burpsuite&logoColor=white",
  "Metasploit": "https://img.shields.io/badge/Metasploit-Framework-333333?logo=metasploit&logoColor=white",
  "Wireshark": "https://img.shields.io/badge/Wireshark-Analysis-1679A7?logo=wireshark&logoColor=white",
  "Kali Linux": "https://img.shields.io/badge/Kali%20Linux-Ready-557C94?logo=kalilinux&logoColor=white",
  "Python": "https://img.shields.io/badge/Python-Scripting-3776AB?logo=python&logoColor=white",
  "Bash": "https://img.shields.io/badge/Bash-Automation-4EAA25?logo=gnu-bash&logoColor=white",
  "Docker": "https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker&logoColor=white",
  "HTB": "https://img.shields.io/badge/Hack%20The%20Box-Ranked-9FEF00?logo=hackthebox&logoColor=black",
  "TryHackMe": "https://img.shields.io/badge/TryHackMe-Top%201%25-C1232B?logo=tryhackme&logoColor=white",
};

export const INITIAL_PROFILE: any = {
  name: "Jane Doe",
  title: "Offensive Security Specialist | Red Teamer",
  bio: "Aspiring Penetration Tester with a strong foundation in network security and web application assessment. Transitioning from a SysAdmin role, I bring 5 years of infrastructure experience to the offensive side. Passionate about CTFs, ethical hacking, and securing digital assets through proactive testing.",
  location: "New York, USA",
  email: "jane.doe@example.com",
  skills: [],
  tools: ["Nmap", "Burp Suite", "Wireshark"],
  certifications: ["eJPT", "CompTIA Security+"],
  socials: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/janedoe" },
    { platform: "TryHackMe", url: "https://tryhackme.com/p/janedoe" },
  ],
};

export const INITIAL_PROJECT: any = {
  title: "E-Commerce Penetration Test",
  overview: "A black-box penetration test conducted on a mock e-commerce environment to identify critical vulnerabilities before production deployment.",
  problem: "The client needed to ensure their new payment gateway integration and user authentication flows were secure against common web attacks like SQLi and XSS.",
  action: "Utilized Burp Suite Pro for mapping the application. Performed manual payload injection for SQLi on search parameters. Used Hydra for brute-forcing weak admin credentials.",
  outcome: "Identified a critical SQL injection vulnerability in the order processing module. Patched the code by implementing parameterized queries. Client successfully passed subsequent compliance scans.",
  toolsUsed: ["Burp Suite", "Nmap", "SQLMap", "Python"],
  reportLink: "https://github.com/username/project/blob/main/report.pdf",
  repoLink: "https://github.com/username/project",
};