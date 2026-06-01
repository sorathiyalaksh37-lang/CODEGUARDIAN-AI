const calculateSeverityBreakdown =
  (reports) => {

    const breakdown = {

      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,

    };

    reports.forEach((report) => {

      if (
        breakdown[report.severity] !== undefined
      ) {

        breakdown[report.severity]++;

      }

    });

    return breakdown;

  };

export default calculateSeverityBreakdown;