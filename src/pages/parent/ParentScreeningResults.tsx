import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ResultsSummary } from '../../components/screening/ResultsComponents';
import { ROUTES } from '../../utils/constants';
import { screeningService } from '../../services/api/screening';
import type { ScreeningResult } from '../../types';
import { LoadingSpinner } from '../../components/common/Loading';

const generatePDF = (result: ScreeningResult) => {
  const childName = localStorage.getItem('latestChildName') || result.childName || 'Child';
  const createdAt = result.createdAt ? new Date(result.createdAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
  
  let content = `AUTISM SCREENING REPORT\n`;
  content += `\n`;
  content += `Child Name: ${childName}\n`;
  content += `Created At: ${createdAt}\n`;
  content += `\n`;
  content += `===========================\n`;
  content += `RESULTS\n`;
  content += `===========================\n`;
  content += `\n`;
  content += `Prediction Class: ${result.predictionClass}\n`;
  content += `Confidence Score: ${result.confidenceScore}%\n`;
  content += `AQ Score: ${result.aqScore}\n`;
  content += `Risk Level: ${result.riskLevel}\n`;
  content += `Probability: ${result.probability}\n`;
  content += `\n`;
  content += `===========================\n`;
  content += `BEHAVIORAL CATEGORIES\n`;
  content += `===========================\n`;
  content += `\n`;
  content += `Social Attention: ${result.socialAttention}%\n`;
  content += `Joint Attention: ${result.jointAttention}%\n`;
  content += `Social Communication: ${result.socialCommunication}%\n`;
  content += `Language: ${result.language}%\n`;
  content += `Imagination: ${result.imagination}%\n`;
  content += `Repetitive Behavior: ${result.repetitiveBehavior}%\n`;

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', `screening-report-${childName.replace(/\s+/g, '-')}.pdf`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const ParentScreeningResults = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<ScreeningResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const childId = params.get('childId');
        if (!childId) {
          setResult(null);
          return;
        }
        const data = await screeningService.getResults(childId);
        if (data.length > 0) setResult(data[0]);
      } catch (err) {
        console.error('Error fetching results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
          <p className="mt-4 text-navy-600 font-medium">Loading your comprehensive results...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Screening Results</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Comprehensive autism spectrum assessment
          </p>
        </div>

        {!result ? (
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 shadow-lg rounded-3xl">
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">📋</div>
              <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">No screening results found.</p>
              <Button onClick={() => navigate(ROUTES.PARENT_SCREENING)} className="bg-orange-600 hover:bg-orange-700 px-8 py-3 text-white font-medium">
                Start Screening Now
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-8">
            <ResultsSummary result={result} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                onClick={() => generatePDF(result)}
                className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/25 rounded-2xl"
              >
                <Download size={20} />
                Export to PDF
              </Button>
              <Button
                variant="outline"
                className="py-4 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-semibold rounded-2xl"
                onClick={() => navigate(ROUTES.PARENT_RE_SCREENING)}
              >
                Take Screening Again
              </Button>
              <Button 
                className="py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold shadow-lg shadow-orange-500/25 rounded-2xl"
                onClick={() => navigate(ROUTES.PARENT_BOOK_SPECIALIST)}
              >
                Book Specialist
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
