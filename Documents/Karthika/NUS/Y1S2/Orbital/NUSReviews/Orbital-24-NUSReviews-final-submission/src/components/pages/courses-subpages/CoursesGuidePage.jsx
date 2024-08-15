import { useState } from 'react';
import './CoursesGuide.css';
import { Link } from 'react-router-dom';
import grad from '../../../assets/images/grad-req.png'
import ge from '../../../assets/images/gemods.png'

const steps = [
  {
    title: "Graduation Requirements",
    content: `Visit the official NUS website to explore the graduation requirements for your course. Look for a 
summary of your Common Curriculum Requirements, Unrestricted Electives & Program Requirements 
similar to the image provided.`,
    img: grad
  },
  {
    title: "Core Modules",
    content: `Review the common curriculum and core module requirements for your degree. More details on specific modules and their assesment modes can 
  be found on NUSMods. Additionally look into Interdisciplinary & Cross-Disciplinary courses your course might require.`
  },
  {
    title: "General Education Modules (GE Mods)",
    content: `The University Level Requirements for General Education, consist of 6 pillars (Total: 24 units, a 4 unit course under each pillar).
Students from CHS and CDE will satisfy GE requirements with courses within their common curriculum.
Students who are enrolled in NUSCollege or Residential College Programmes may not be required to read all six GE pillars.
Please refer to this <a href="https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/general-education/list-of-courses-approved-under-the-ge-pillars" target="_blank" rel="noopener noreferrer">link</a> for the list of courses approved under the six GE pillars.`,
    img: ge
  },
  {
    title: "Special Programmes",
    content: `After examining your common and core curriculum requirements. Take a look at your workload and the available modular credits for unrestricted 
electives. Decide if you want to pursue any <a href="https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/special-programmes" target="_blank" rel="noopener noreferrer">special programmes</a> such as a minor, a second major or a specialisation. If you already have one, 
consider its requirements and which modules can be double-counted.`,
  },
  {
    title: "Exchange Programs",
    content: `Start planning early if you are considering an exchange program. Module mapping must be done in advance, so proper planning is essential.
<a href="https://www.nus.edu.sg/gro/global-programmes/student-exchange" target="_blank" rel="noopener noreferrer">Student Exchange Programme (SEP)</a>
<a href="https://www.nus.edu.sg/gro/global-programmes/summer-and-winter-programmes" target="_blank" rel="noopener noreferrer">Summer & Winter Programmes</a>
<a href="https://enterprise.nus.edu.sg/education-programmes/nus-overseas-colleges/" target="_blank" rel="noopener noreferrer">NUS Overseas Colleges (NOC)</a>
`
  }
];

const CoursesGuidePage = () => {
  const [activeStep, setActiveStep] = useState(null);

  const handleToggle = (index) => {
    setActiveStep(activeStep === index ? null : index);
  };

  return (
    <div className="guide-container">
      <h1>Undergraduate Guide</h1>
      <h2>After completing the <Link to='https://sway.cloud.microsoft/SMUhZNzTiT7QN1Fn' className='registration-link'>registration process</Link> for their courses, students might wonder how to plan their academic journey effectively.</h2>
      {steps.map((step, index) => (
        <div key={index} className="step-container">
          <div className="step-title" onClick={() => handleToggle(index)}>
            {step.title}
          </div>
          {activeStep === index && (
            <div className="step-content">
              <div className="step-text" dangerouslySetInnerHTML={{__html: step.content}}></div>
              {step.img && (
                <div className="step-image">
                  <img src={step.img} alt={step.title} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CoursesGuidePage;
