import { jsPDF } from "jspdf";

const generatePDF = (examQuestions) => {
  const doc = new jsPDF();
  
  // Professional color scheme
  const colors = {
    primary: [41, 128, 185],     // Professional blue
    secondary: [52, 73, 94],     // Dark gray
    accent: [231, 76, 60],       // Red for emphasis
    text: [44, 62, 80],          // Dark blue-gray
    lightGray: [149, 165, 166]   // Light gray for borders
  };

  // Typography settings
  const fonts = {
    title: { size: 18, weight: 'bold' },
    subtitle: { size: 14, weight: 'bold' },
    header: { size: 12, weight: 'bold' },
    body: { size: 10, weight: 'normal' },
    question: { size: 11, weight: 'bold' },
    option: { size: 10, weight: 'normal' },
    small: { size: 9, weight: 'normal' }
  };

  // Page margins and layout
  const layout = {
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    pageWidth: 210,
    pageHeight: 297,
    lineHeight: 6,
    sectionSpacing: 15,
    questionSpacing: 12
  };

  let currentY = layout.margin.top;

  // Helper function to add a line/border
  const addLine = (x1, y1, x2, y2, color = colors.lightGray) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y2);
  };

  // Helper function to add a rectangle/box
  const addBox = (x, y, width, height, fillColor = null, borderColor = colors.lightGray) => {
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    if (fillColor) {
      doc.setFillColor(...fillColor);
      doc.rect(x, y, width, height, 'FD');
    } else {
      doc.rect(x, y, width, height, 'S');
    }
  };

  // Helper function to check page overflow and add new page if needed
  const checkPageOverflow = (requiredHeight) => {
    if (currentY + requiredHeight > layout.pageHeight - layout.margin.bottom) {
      doc.addPage();
      currentY = layout.margin.top;
      return true;
    }
    return false;
  };

  // HEADER SECTION
  // Title with background box
  addBox(layout.margin.left, currentY, 
         layout.pageWidth - layout.margin.left - layout.margin.right, 
         25, [245, 245, 245]);
  
  doc.setFont('helvetica', fonts.title.weight);
  doc.setFontSize(fonts.title.size);
  doc.setTextColor(...colors.primary);
  doc.text(examConfig.title, layout.pageWidth / 2, currentY + 16, { align: 'center' });
  
  currentY += 35;

  // Exam details in a structured layout
  const detailsY = currentY;
  doc.setFont('helvetica', fonts.body.weight);
  doc.setFontSize(fonts.body.size);
  doc.setTextColor(...colors.text);

  // Left column
  doc.setFont('helvetica', 'bold');
  doc.text('Class:', layout.margin.left, detailsY);
  doc.text('Subject:', layout.margin.left, detailsY + 7);
  doc.text('Duration:', layout.margin.left, detailsY + 14);
  doc.text('Total Questions:', layout.margin.left, detailsY + 21);

  doc.setFont('helvetica', 'normal');
  doc.text(examConfig.class || 'Not specified', layout.margin.left + 30, detailsY);
  doc.text(examConfig.subject || 'Not specified', layout.margin.left + 30, detailsY + 7);
  doc.text(examConfig.duration || '2 Hours', layout.margin.left + 30, detailsY + 14);
  doc.text(examQuestions.length.toString(), layout.margin.left + 30, detailsY + 21);

  // Right column - Date and time
  const rightColumnX = layout.pageWidth - 70;
  doc.setFont('helvetica', 'bold');
  doc.text('Date:', rightColumnX, detailsY);
  doc.text('Time:', rightColumnX, detailsY + 7);
  doc.text('Max Marks:', rightColumnX, detailsY + 14);

  doc.setFont('helvetica', 'normal');
  doc.text('___________', rightColumnX + 20, detailsY);
  doc.text('___________', rightColumnX + 20, detailsY + 7);
  doc.text(examConfig.maxMarks || examQuestions.length.toString(), rightColumnX + 20, detailsY + 14);

  currentY += 35;

  // Student details section
  addLine(layout.margin.left, currentY, layout.pageWidth - layout.margin.right, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fonts.body.size);
  doc.text('Student Name: ________________________', layout.margin.left, currentY);
  doc.text('Roll No: __________', rightColumnX, currentY);
  currentY += 8;
  doc.text('Section: __________', layout.margin.left, currentY);
  doc.text('Signature: __________', rightColumnX, currentY);

  currentY += 15;
  addLine(layout.margin.left, currentY, layout.pageWidth - layout.margin.right, currentY);
  currentY += 10;

  // INSTRUCTIONS SECTION
  if (examConfig.instructions && examConfig.instructions.trim()) {
    checkPageOverflow(30);
    
    doc.setFont('helvetica', fonts.header.weight);
    doc.setFontSize(fonts.header.size);
    doc.setTextColor(...colors.secondary);
    doc.text('INSTRUCTIONS:', layout.margin.left, currentY);
    currentY += 8;

    doc.setFont('helvetica', fonts.body.weight);
    doc.setFontSize(fonts.body.size);
    doc.setTextColor(...colors.text);
    
    const instructions = doc.splitTextToSize(
      examConfig.instructions, 
      layout.pageWidth - layout.margin.left - layout.margin.right
    );
    
    instructions.forEach(line => {
      checkPageOverflow(layout.lineHeight);
      doc.text(line, layout.margin.left, currentY);
      currentY += layout.lineHeight;
    });

    currentY += layout.sectionSpacing;
    addLine(layout.margin.left, currentY, layout.pageWidth - layout.margin.right, currentY);
    currentY += 10;
  }

  // QUESTIONS SECTION
  doc.setFont('helvetica', fonts.header.weight);
  doc.setFontSize(fonts.header.size);
  doc.setTextColor(...colors.secondary);
  doc.text('QUESTIONS:', layout.margin.left, currentY);
  currentY += layout.sectionSpacing;

  examQuestions.forEach((q, index) => {
    // Calculate required height for this question
    let questionHeight = 20; // Base height for question text
    if (q.question_type === 'MCQ' && q.options) {
      questionHeight += q.options.length * 8 + 10;
    } else {
      questionHeight += 20; // Space for written answer
    }

    checkPageOverflow(questionHeight);

    // Question number and text
    doc.setFont('helvetica', fonts.question.weight);
    doc.setFontSize(fonts.question.size);
    doc.setTextColor(...colors.text);
    
    const questionText = `Q${index + 1}. ${q.question}`;
    const questionLines = doc.splitTextToSize(
      questionText, 
      layout.pageWidth - layout.margin.left - layout.margin.right - 10
    );
    
    questionLines.forEach((line, lineIndex) => {
      if (lineIndex > 0) checkPageOverflow(layout.lineHeight);
      doc.text(line, layout.margin.left, currentY);
      currentY += layout.lineHeight;
    });

    currentY += 5;

    // Handle different question types
    if (q.question_type === 'MCQ' && q.options) {
      doc.setFont('helvetica', fonts.option.weight);
      doc.setFontSize(fonts.option.size);
      
      q.options.forEach((option, optIndex) => {
        checkPageOverflow(layout.lineHeight + 2);
        
        const optionLetter = String.fromCharCode(65 + optIndex);
        const optionText = `${optionLetter}. ${option}`;
        
        // Add option box for marking
        addBox(layout.margin.left + 5, currentY - 4, 4, 4);
        
        doc.text(optionText, layout.margin.left + 15, currentY);
        currentY += layout.lineHeight + 2;
      });
    } else {
      // Space for written answers
      doc.setFont('helvetica', fonts.small.weight);
      doc.setFontSize(fonts.small.size);
      doc.setTextColor(...colors.lightGray);
      doc.text('Answer:', layout.margin.left, currentY);
      currentY += 8;
      
      // Add answer lines
      for (let i = 0; i < 3; i++) {
        checkPageOverflow(8);
        addLine(layout.margin.left, currentY, layout.pageWidth - layout.margin.right, currentY, [200, 200, 200]);
        currentY += 8;
      }
    }

    currentY += layout.questionSpacing;
    
    // Add marks allocation
    if (q.marks) {
      doc.setFont('helvetica', fonts.small.weight);
      doc.setFontSize(fonts.small.size);
      doc.setTextColor(...colors.secondary);
      doc.text(`[${q.marks} mark${q.marks > 1 ? 's' : ''}]`, layout.pageWidth - 40, currentY - layout.questionSpacing + 5);
    }
  });

  // ANSWER KEY SECTION (if requested)
  if (examConfig.includeAnswerKey) {
    doc.addPage();
    currentY = layout.margin.top;

    // Answer key header
    addBox(layout.margin.left, currentY, 
           layout.pageWidth - layout.margin.left - layout.margin.right, 
           15, [240, 240, 240]);
    
    doc.setFont('helvetica', fonts.subtitle.weight);
    doc.setFontSize(fonts.subtitle.size);
    doc.setTextColor(...colors.accent);
    doc.text('ANSWER KEY', layout.pageWidth / 2, currentY + 10, { align: 'center' });
    
    currentY += 25;

    doc.setFont('helvetica', fonts.body.weight);
    doc.setFontSize(fonts.body.size);
    doc.setTextColor(...colors.text);

    examQuestions.forEach((q, index) => {
      checkPageOverflow(layout.lineHeight);
      
      let answerText = '';
      if (q.question_type === 'MCQ' && typeof q.correctAnswer === 'number') {
        answerText = `${index + 1}. ${String.fromCharCode(65 + q.correctAnswer)}`;
      } else if (q.answer) {
        const shortAnswer = q.answer.length > 50 ? 
          q.answer.substring(0, 50) + '...' : q.answer;
        answerText = `${index + 1}. ${shortAnswer}`;
      } else {
        answerText = `${index + 1}. [Answer not provided]`;
      }
      
      doc.text(answerText, layout.margin.left, currentY);
      currentY += layout.lineHeight + 2;
    });
  }

  // Footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', fonts.small.weight);
    doc.setFontSize(fonts.small.size);
    doc.setTextColor(...colors.lightGray);
    
    const footerText = `Page ${i} of ${pageCount}`;
    doc.text(footerText, layout.pageWidth / 2, layout.pageHeight - 10, { align: 'center' });
    
    // Add a subtle footer line
    addLine(layout.margin.left, layout.pageHeight - 15, 
            layout.pageWidth - layout.margin.right, layout.pageHeight - 15, 
            [220, 220, 220]);
  }

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `${examConfig.class || 'Exam'}_${examConfig.subject || 'Paper'}_${timestamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
};


export default generatePDF;