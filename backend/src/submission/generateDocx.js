/**
 * Darukaa.Earth AI Biodiversity Intelligence System
 * Submission Word Document (.docx) Generator (ES Modules)
 */

import fs from 'fs';
import path from 'path';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, ShadingType } from 'docx';

export async function createSubmissionDocx(outputPath = null) {
  const finalPath = outputPath || path.join(process.cwd(), 'Darukaa_Earth_AI_Biodiversity_Submission.docx');

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000
            }
          }
        },
        children: [
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "Darukaa.Earth: AI Biodiversity Intelligence Challenge",
                bold: true,
                size: 36,
                color: "0F5132"
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "Official Technical Submission Document | AI Environmental Scientist System",
                italics: true,
                size: 24,
                color: "64748B"
              })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: "1. Project Links & Submission Overview",
                bold: true,
                size: 28,
                color: "0F5132"
              })
            ]
          }),

          new Table({
            alignment: AlignmentType.CENTER,
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "GitHub Repository Link", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "https://github.com/darukaa-earth-submission/ai-biodiversity-intelligence", size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Live Demo URL", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "http://localhost:3000 (React Frontend) & http://localhost:5000 (Express Backend)", size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Technology Stack", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "Frontend: React + Tailwind CSS | Backend: Node.js + Express (ES Modules)", size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: "Knowledge Corpus Sources", bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "FAO, IPCC AR6 WGII, IPBES Global Assessment, ICRAF/World Agroforestry, Nature Ecology, Science", size: 20 })] })]
                  })
                ]
              })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "2. Repository Access Grants",
                bold: true,
                size: 28,
                color: "0F5132"
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "As required by the submission guidelines, read and review access has been provisioned to the following Darukaa.Earth evaluation team accounts:",
                size: 21
              })
            ]
          }),
          new Paragraph({ children: [new TextRun({ text: "• ankita.dasgupta@darukaa.com", bold: true, size: 21 })] }),
          new Paragraph({ children: [new TextRun({ text: "• harsh.kumar@darukaa.com", bold: true, size: 21 })] }),
          new Paragraph({ children: [new TextRun({ text: "• utkarsh.gauniyal@darukaa.com", bold: true, size: 21 })] }),
          new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "• guneet.mutreja@darukaa.com", bold: true, size: 21 })] }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: "3. System Architecture & Scientific Reasoning Framework",
                bold: true,
                size: 28,
                color: "0F5132"
              })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "The system is engineered as an AI Environmental Scientist coupling four core modules:",
                size: 21
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "1. Structured Knowledge Layer (RAG): ", bold: true, size: 21 }),
              new TextRun({ text: "Curated peer-reviewed corpus (FAO, IPCC AR6, IPBES, ICRAF, Nature) with TF-IDF vector space modeling, cosine similarity, and taxonomy boosting.", size: 21 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "2. Multi-Metric Reasoning Engine: ", bold: true, size: 21 }),
              new TextRun({ text: "Evaluates >= 3 coupled variables (SOC ↔ Precipitation ↔ Land Use ↔ Biota ↔ Pollinator Networks) with quantitative trajectory forecasts over 1, 3, and 10 years.", size: 21 })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "3. Conversational Intelligence & Clarification Agent: ", bold: true, size: 21 }),
              new TextRun({ text: "Multi-turn dialogue state manager that diagnoses incomplete queries, prompts clarifying questions, and accumulates verified parameters.", size: 21 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "4. Spatial Context Resolver: ", bold: true, size: 21 }),
              new TextRun({ text: "Translates geographic coordinates to Köppen climate classes, rainfall averages, and soil baselines.", size: 21 })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: "4. Benchmark Case Study: Semi-Arid Monoculture Wheat",
                bold: true,
                size: 28,
                color: "0F5132"
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Input: ", bold: true, size: 21 }),
              new TextRun({ text: "Soil organic carbon: 0.3%, Rainfall: Low, Crop: Monoculture Wheat, Region: Semi-arid.\n", size: 21 }),
              new TextRun({ text: "Primary Recommendation: ", bold: true, size: 21 }),
              new TextRun({ text: "Reverse-Phenology Agroforestry (Faidherbia albida at 30 trees/ha) + Cajanus cajan interrow legume planting.\n", size: 21 }),
              new TextRun({ text: "Why it works: ", bold: true, size: 21 }),
              new TextRun({ text: "Faidherbia albida sheds foliage during wet cereal growing seasons (eliminating canopy light competition) and supplies 35-55 kg N/ha, while 15m taproots execute hydraulic lift. Glomalin exudation stabilizes soil macro-aggregates.\n", size: 21 }),
              new TextRun({ text: "Quantified Deltas: ", bold: true, size: 21 }),
              new TextRun({ text: "SOC +18-32% over 3 years, topsoil water capacity +32%, canopy cooling of 2.2-3.8°C.\n", size: 21 }),
              new TextRun({ text: "Authoritative Citations: ", bold: true, size: 21 }),
              new TextRun({ text: "FAO (2022) Recarbonizing Global Soils (Vol 3) & IPCC (2022) AR6 WGII Ch. 5.", size: 21 })
            ]
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "5. Local Setup & CI/CD Instructions",
                bold: true,
                size: 28,
                color: "0F5132"
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. Backend (Express):\n   cd backend && npm install && npm start (Port 5000)\n\n" +
                      "2. Frontend (React + Tailwind):\n   cd frontend && npm install && npm run dev (Port 3000)\n\n" +
                      "3. Automated Tests:\n   cd backend && npm test\n\n" +
                      "4. CI/CD:\n   GitHub Actions (.github/workflows/ci.yml) validates automated tests on every pull request.",
                size: 20
              })
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(finalPath, buffer);
  return finalPath;
}
