### Non-Functional Requirements

1. **Usability**
   - The system should provide a user-friendly interface for the selection committee, making it easy to navigate and use without extensive training.
   - Clear visualization of recommendations should be included to aid decision-making.

2. **Performance**
   - The LLM-based evaluation system should process and analyze application materials within a reasonable timeframe (under 10 seconds per application) to ensure timely evaluation during peak application periods.
   - The system must handle concurrent requests from multiple users (at least 20 simultaneous users) without performance degradation.

3. **Reliability**
   - The system should have an uptime of at least 99.5% to ensure availability during critical application evaluation periods.
   - The evaluation algorithms should consistently provide accurate recommendations with minimal errors in scoring and ranking.

4. **Scalability**
   - The system should be scalable to accommodate an increase in the number of applications, especially during peak admission cycles.
   - The backend infrastructure should support scaling to analyze data from diverse programs and courses without requiring substantial reconfiguration.

5. **Security**
   - The system must ensure the confidentiality of applicant data by implementing robust encryption methods for data storage and transmission.
   - Only authorized personnel should have access to the application data, with user authentication and role-based access controls enforced.

6. **Fairness and Transparency**
   - Evaluation algorithms must be fair and unbiased, ensuring no discrimination based on any personal or demographic attributes.
   - The scoring methodology and evaluation process should be transparent, with explanations available for each recommendation.

7. **Maintainability**
   - The codebase should be modular and well-documented to facilitate easy updates and maintenance by future developers.
   - System components should be designed to allow for easy modification of evaluation criteria as the university’s admission policies evolve.

8. **Compliance**
   - The system should comply with relevant data protection regulations, such as GDPR, ensuring that applicants’ personal data is handled responsibly.
   - The evaluation and recommendation criteria should align with the Technical University of Munich’s admission standards and policies.

