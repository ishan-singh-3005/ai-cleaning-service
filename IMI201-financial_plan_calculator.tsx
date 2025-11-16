import React, { useState } from 'react';
import { Download } from 'lucide-react';

const FinancialPlanCalculator = () => {
  const [assumptions, setAssumptions] = useState({
    subscriptionPrice: 200,
    oneTimePrice: 150,
    year1Subscribers: 500,
    year1OneTime: 1200,
    subscriberGrowthRate: 40,
    oneTimeGrowthRate: 30,
    subscriptionsPerMonth: 1,
    hoursPerJob: 2,
    travelTimePerJob: 1,
    chargingTimePerDay: 2,
    hoursPerRobotPerDay: 8,
    daysPerMonth: 22,
    utilizationRate: 70,
    robotCostPerUnit: 25000,
    maintenancePerRobot: 3000,
    robotsPerStation: 15,
    stationCostPerUnit: 50000,
    stationMaintenancePerYear: 5000,
    salaryPerEmployee: 50000,
    employeesYear1: 5,
    employeeGrowthRate: 20,
    marketingBudgetYear1: 50000,
    marketingGrowthRate: 25,
    insuranceYear1: 15000,
    insuranceGrowthRate: 10,
    utilitiesYear1: 10000,
    utilitiesGrowthRate: 15,
    taxRate: 25
  });

  const calculateFinancials = () => {
    const years = [1, 2, 3, 4, 5];
    const financials = [];
    
    for (let i = 0; i < years.length; i++) {
      const year = years[i];
      const subscribers = Math.round(assumptions.year1Subscribers * Math.pow(1 + assumptions.subscriberGrowthRate / 100, year - 1));
      const oneTimeCustomers = Math.round(assumptions.year1OneTime * Math.pow(1 + assumptions.oneTimeGrowthRate / 100, year - 1));
      const subscriptionRevenue = subscribers * assumptions.subscriptionPrice * 12;
      const oneTimeRevenue = oneTimeCustomers * assumptions.oneTimePrice;
      const totalRevenue = subscriptionRevenue + oneTimeRevenue;
      
      const totalJobsPerMonth = (subscribers * assumptions.subscriptionsPerMonth) + (oneTimeCustomers / 12);
      const totalJobsPerYear = Math.round(totalJobsPerMonth * 12);
      const totalTimePerJob = assumptions.hoursPerJob + assumptions.travelTimePerJob;
      const totalHoursNeeded = totalJobsPerYear * totalTimePerJob;
      const effectiveHoursPerDay = assumptions.hoursPerRobotPerDay - assumptions.chargingTimePerDay;
      const hoursPerRobotPerYear = effectiveHoursPerDay * assumptions.daysPerMonth * 12;
      const adjustedHoursPerRobot = hoursPerRobotPerYear * (assumptions.utilizationRate / 100);
      const robots = Math.ceil(totalHoursNeeded / adjustedHoursPerRobot);
      const previousRobots = i > 0 ? financials[i - 1].robots : 0;
      const robotCosts = year === 1 ? robots * assumptions.robotCostPerUnit : Math.max(0, (robots - previousRobots) * assumptions.robotCostPerUnit);
      const robotMaintenance = robots * assumptions.maintenancePerRobot;
      
      const stations = Math.ceil(robots / assumptions.robotsPerStation);
      const previousStations = i > 0 ? financials[i - 1].stations : 0;
      const stationCosts = year === 1 ? stations * assumptions.stationCostPerUnit : Math.max(0, (stations - previousStations) * assumptions.stationCostPerUnit);
      const stationMaintenance = stations * assumptions.stationMaintenancePerYear;
      
      const totalCOGS = robotCosts + robotMaintenance + stationCosts + stationMaintenance;
      const grossProfit = totalRevenue - totalCOGS;
      const grossMargin = (grossProfit / totalRevenue * 100).toFixed(1);
      
      const employees = Math.round(assumptions.employeesYear1 * Math.pow(1 + assumptions.employeeGrowthRate / 100, year - 1));
      const salaries = employees * assumptions.salaryPerEmployee;
      const marketing = Math.round(assumptions.marketingBudgetYear1 * Math.pow(1 + assumptions.marketingGrowthRate / 100, year - 1));
      const insurance = Math.round(assumptions.insuranceYear1 * Math.pow(1 + assumptions.insuranceGrowthRate / 100, year - 1));
      const utilities = Math.round(assumptions.utilitiesYear1 * Math.pow(1 + assumptions.utilitiesGrowthRate / 100, year - 1));
      const totalOpEx = salaries + marketing + insurance + utilities;
      
      const ebitda = grossProfit - totalOpEx;
      const taxes = ebitda > 0 ? ebitda * (assumptions.taxRate / 100) : 0;
      const netIncome = ebitda - taxes;
      const netMargin = (netIncome / totalRevenue * 100).toFixed(1);
      
      financials.push({
        year,
        subscribers,
        oneTimeCustomers,
        totalJobsPerYear,
        subscriptionRevenue,
        oneTimeRevenue,
        totalRevenue,
        robots,
        robotCosts,
        robotMaintenance,
        stations,
        stationCosts,
        stationMaintenance,
        totalCOGS,
        grossProfit,
        grossMargin,
        employees,
        salaries,
        marketing,
        insurance,
        utilities,
        totalOpEx,
        ebitda,
        taxes,
        netIncome,
        netMargin
      });
    }
    
    return financials;
  };

  const financials = calculateFinancials();

  const handleChange = (field, value) => {
    setAssumptions(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const exportToCSV = () => {
    let csv = 'ASSUMPTIONS\n';
    csv += 'Category,Item,Value\n';
    csv += `Revenue,Monthly Subscription Price,$${assumptions.subscriptionPrice}\n`;
    csv += `Revenue,One-Time Service Price,$${assumptions.oneTimePrice}\n`;
    csv += `Revenue,Year 1 Subscribers,${assumptions.year1Subscribers}\n`;
    csv += `Revenue,Year 1 One-Time Customers,${assumptions.year1OneTime}\n`;
    csv += `Revenue,Subscriber Growth Rate,${assumptions.subscriberGrowthRate}%\n`;
    csv += `Revenue,One-Time Growth Rate,${assumptions.oneTimeGrowthRate}%\n`;
    csv += '\n';
    
    csv += 'FINANCIAL PROJECTIONS\n';
    csv += 'Metric,' + financials.map(f => `Year ${f.year}`).join(',') + '\n';
    
    csv += '\nREVENUE\n';
    csv += 'Subscribers,' + financials.map(f => f.subscribers).join(',') + '\n';
    csv += 'One-Time Customers,' + financials.map(f => f.oneTimeCustomers).join(',') + '\n';
    csv += 'Total Jobs Per Year,' + financials.map(f => f.totalJobsPerYear).join(',') + '\n';
    csv += 'Subscription Revenue,' + financials.map(f => `${f.subscriptionRevenue.toLocaleString()}`).join(',') + '\n';
    csv += 'One-Time Revenue,' + financials.map(f => `${f.oneTimeRevenue.toLocaleString()}`).join(',') + '\n';
    csv += 'Total Revenue,' + financials.map(f => `${f.totalRevenue.toLocaleString()}`).join(',') + '\n';
    
    csv += '\nCOST OF GOODS SOLD\n';
    csv += 'Number of Robots,' + financials.map(f => f.robots).join(',') + '\n';
    csv += 'Robot Acquisition Costs,' + financials.map(f => `$${f.robotCosts.toLocaleString()}`).join(',') + '\n';
    csv += 'Robot Maintenance,' + financials.map(f => `$${f.robotMaintenance.toLocaleString()}`).join(',') + '\n';
    csv += 'Number of Stations,' + financials.map(f => f.stations).join(',') + '\n';
    csv += 'Station Costs,' + financials.map(f => `$${f.stationCosts.toLocaleString()}`).join(',') + '\n';
    csv += 'Station Maintenance,' + financials.map(f => `$${f.stationMaintenance.toLocaleString()}`).join(',') + '\n';
    csv += 'Total COGS,' + financials.map(f => `$${f.totalCOGS.toLocaleString()}`).join(',') + '\n';
    csv += 'Gross Profit,' + financials.map(f => `$${f.grossProfit.toLocaleString()}`).join(',') + '\n';
    csv += 'Gross Margin,' + financials.map(f => `${f.grossMargin}%`).join(',') + '\n';
    
    csv += '\nOPERATING EXPENSES\n';
    csv += 'Number of Employees,' + financials.map(f => f.employees).join(',') + '\n';
    csv += 'Salaries & Wages,' + financials.map(f => `$${f.salaries.toLocaleString()}`).join(',') + '\n';
    csv += 'Marketing,' + financials.map(f => `$${f.marketing.toLocaleString()}`).join(',') + '\n';
    csv += 'Insurance,' + financials.map(f => `$${f.insurance.toLocaleString()}`).join(',') + '\n';
    csv += 'Utilities & Rent,' + financials.map(f => `$${f.utilities.toLocaleString()}`).join(',') + '\n';
    csv += 'Total Operating Expenses,' + financials.map(f => `$${f.totalOpEx.toLocaleString()}`).join(',') + '\n';
    
    csv += '\nPROFITABILITY\n';
    csv += 'EBITDA,' + financials.map(f => `$${f.ebitda.toLocaleString()}`).join(',') + '\n';
    csv += 'Taxes,' + financials.map(f => `$${f.taxes.toLocaleString()}`).join(',') + '\n';
    csv += 'Net Income,' + financials.map(f => `$${f.netIncome.toLocaleString()}`).join(',') + '\n';
    csv += 'Net Margin,' + financials.map(f => `${f.netMargin}%`).join(',') + '\n';

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_plan_5year.csv';
    a.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">AI Cleaning Service - 5-Year Financial Plan</h1>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download size={20} />
            Export to CSV
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Key Assumptions (Adjust Values)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-blue-900">Revenue</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Monthly Subscription Price ($)</label>
                  <input
                    type="number"
                    value={assumptions.subscriptionPrice}
                    onChange={(e) => handleChange('subscriptionPrice', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">One-Time Service Price ($)</label>
                  <input
                    type="number"
                    value={assumptions.oneTimePrice}
                    onChange={(e) => handleChange('oneTimePrice', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Year 1 Subscribers</label>
                  <input
                    type="number"
                    value={assumptions.year1Subscribers}
                    onChange={(e) => handleChange('year1Subscribers', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Year 1 One-Time Customers</label>
                  <input
                    type="number"
                    value={assumptions.year1OneTime}
                    onChange={(e) => handleChange('year1OneTime', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Subscriber Growth Rate (%)</label>
                  <input
                    type="number"
                    value={assumptions.subscriberGrowthRate}
                    onChange={(e) => handleChange('subscriberGrowthRate', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">One-Time Growth Rate (%)</label>
                  <input
                    type="number"
                    value={assumptions.oneTimeGrowthRate}
                    onChange={(e) => handleChange('oneTimeGrowthRate', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Cleanings Per Subscriber Per Month</label>
                  <input
                    type="number"
                    step="0.1"
                    value={assumptions.subscriptionsPerMonth}
                    onChange={(e) => handleChange('subscriptionsPerMonth', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g., 1 = monthly, 4 = weekly</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-green-900">Operations & Capacity</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Hours Per Job (cleaning time)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={assumptions.hoursPerJob}
                    onChange={(e) => handleChange('hoursPerJob', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Travel Time Per Job (hours)</label>
                  <input
                    type="number"
                    step="0.25"
                    value={assumptions.travelTimePerJob}
                    onChange={(e) => handleChange('travelTimePerJob', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">To/from job site + setup</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Charging Time Per Day (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={assumptions.chargingTimePerDay}
                    onChange={(e) => handleChange('chargingTimePerDay', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Total Hours Per Robot Per Day</label>
                  <input
                    type="number"
                    value={assumptions.hoursPerRobotPerDay}
                    onChange={(e) => handleChange('hoursPerRobotPerDay', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Max available hours in a day</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Robot Utilization Rate (%)</label>
                  <input
                    type="number"
                    value={assumptions.utilizationRate}
                    onChange={(e) => handleChange('utilizationRate', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Accounts for maintenance & downtime</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Working Days Per Month</label>
                  <input
                    type="number"
                    value={assumptions.daysPerMonth}
                    onChange={(e) => handleChange('daysPerMonth', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Robot Cost Per Unit ($)</label>
                  <input
                    type="number"
                    value={assumptions.robotCostPerUnit}
                    onChange={(e) => handleChange('robotCostPerUnit', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Maintenance Per Robot ($/year)</label>
                  <input
                    type="number"
                    value={assumptions.maintenancePerRobot}
                    onChange={(e) => handleChange('maintenancePerRobot', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Robots Per Station</label>
                  <input
                    type="number"
                    value={assumptions.robotsPerStation}
                    onChange={(e) => handleChange('robotsPerStation', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Station Cost Per Unit ($)</label>
                  <input
                    type="number"
                    value={assumptions.stationCostPerUnit}
                    onChange={(e) => handleChange('stationCostPerUnit', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Station Maintenance ($/year)</label>
                  <input
                    type="number"
                    value={assumptions.stationMaintenancePerYear}
                    onChange={(e) => handleChange('stationMaintenancePerYear', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-purple-900">Operating Expenses</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Salary Per Employee ($)</label>
                  <input
                    type="number"
                    value={assumptions.salaryPerEmployee}
                    onChange={(e) => handleChange('salaryPerEmployee', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Year 1 Employees</label>
                  <input
                    type="number"
                    value={assumptions.employeesYear1}
                    onChange={(e) => handleChange('employeesYear1', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Employee Growth Rate (%)</label>
                  <input
                    type="number"
                    value={assumptions.employeeGrowthRate}
                    onChange={(e) => handleChange('employeeGrowthRate', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Year 1 Marketing Budget ($)</label>
                  <input
                    type="number"
                    value={assumptions.marketingBudgetYear1}
                    onChange={(e) => handleChange('marketingBudgetYear1', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Marketing Growth Rate (%)</label>
                  <input
                    type="number"
                    value={assumptions.marketingGrowthRate}
                    onChange={(e) => handleChange('marketingGrowthRate', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={assumptions.taxRate}
                    onChange={(e) => handleChange('taxRate', e.target.value)}
                    className="w-full px-3 py-1 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Revenue Projections</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-2 text-left">Metric</th>
                  {financials.map(f => (
                    <th key={f.year} className="border p-2 text-right">Year {f.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Subscribers</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.subscribers.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">One-Time Customers</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.oneTimeCustomers.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-blue-50">
                  <td className="border p-2 font-medium">Total Jobs Per Year</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.totalJobsPerYear.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Subscription Revenue</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.subscriptionRevenue.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">One-Time Revenue</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.oneTimeRevenue.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-blue-200 font-bold">
                  <td className="border p-2">Total Revenue</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.totalRevenue.toLocaleString()}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Cost of Goods Sold</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100">
                  <th className="border p-2 text-left">Metric</th>
                  {financials.map(f => (
                    <th key={f.year} className="border p-2 text-right">Year {f.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Number of Robots</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.robots}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Robot Acquisition</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.robotCosts.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Robot Maintenance</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.robotMaintenance.toLocaleString()}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Number of Stations</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.stations}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Station Costs</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.stationCosts.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Station Maintenance</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.stationMaintenance.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-green-200 font-bold">
                  <td className="border p-2">Total COGS</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.totalCOGS.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-green-300 font-bold">
                  <td className="border p-2">Gross Profit</td>
                  {financials.map(f => (
                    <td key={f.year} className={`border p-2 text-right ${f.grossProfit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${f.grossProfit.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="font-semibold">
                  <td className="border p-2">Gross Margin</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.grossMargin}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Operating Expenses</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border p-2 text-left">Metric</th>
                  {financials.map(f => (
                    <th key={f.year} className="border p-2 text-right">Year {f.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-medium">Number of Employees</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.employees}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Salaries & Wages</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.salaries.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Marketing</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.marketing.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Insurance</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.insurance.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Utilities & Rent</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.utilities.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-purple-200 font-bold">
                  <td className="border p-2">Total Operating Expenses</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.totalOpEx.toLocaleString()}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Profitability</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-yellow-100">
                  <th className="border p-2 text-left">Metric</th>
                  {financials.map(f => (
                    <th key={f.year} className="border p-2 text-right">Year {f.year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">EBITDA</td>
                  {financials.map(f => (
                    <td key={f.year} className={`border p-2 text-right ${f.ebitda < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${f.ebitda.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border p-2 font-medium">Taxes</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">${f.taxes.toLocaleString()}</td>
                  ))}
                </tr>
                <tr className="bg-yellow-200 font-bold text-lg">
                  <td className="border p-2">Net Income</td>
                  {financials.map(f => (
                    <td key={f.year} className={`border p-2 text-right ${f.netIncome < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${f.netIncome.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="font-semibold">
                  <td className="border p-2">Net Margin</td>
                  {financials.map(f => (
                    <td key={f.year} className="border p-2 text-right">{f.netMargin}%</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanCalculator;