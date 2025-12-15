import ReportItem from './ReportItem';
import Card from '../common/Card';
import './ReportList.css';

const ReportList = ({ 
    reports, 
    title, 
    icon = 'list',
    showCitizenInfo = false, 
    showActions = false,
    emptyMessage = 'No hay reportes para mostrar'
}) => {
    if (!reports || reports.length === 0) {
        return (
            <Card title={title} icon={icon}>
                <p className="empty-message">{emptyMessage}</p>
            </Card>
        );
    }

    return (
        <Card title={title} icon={icon}>
            <div className="report-list">
                {reports.map(report => (
                    <ReportItem
                        key={report.id}
                        report={report}
                        showCitizenInfo={showCitizenInfo}
                        showActions={showActions}
                    />
                ))}
            </div>
        </Card>
    );
};

export default ReportList; 
