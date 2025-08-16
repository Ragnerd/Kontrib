import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Target, 
  Calendar, 
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { formatNaira, calculateProgress } from "@/lib/currency";

interface GroupLandingData {
  group: {
    id: string;
    name: string;
    description: string;
    adminId: string;
  };
  projects: Array<{
    id: string;
    name: string;
    targetAmount: string;
    collectedAmount: string;
    deadline: string;
  }>;
  memberCount: number;
  totalTarget: string;
  totalCollected: string;
}

export default function GroupLanding() {
  const { registrationId } = useParams();
  const [, navigate] = useLocation();

  // Fetch group landing data
  const { data: groupData, isLoading: groupLoading } = useQuery<GroupLandingData>({
    queryKey: ["/api/groups/registration", registrationId],
    enabled: !!registrationId
  });

  // Calculate days remaining until earliest deadline
  const getDaysRemaining = () => {
    if (!groupData?.projects.length) return null;
    
    const earliestDeadline = groupData.projects.reduce((earliest, project) => {
      const projectDeadline = new Date(project.deadline);
      return !earliest || projectDeadline < earliest ? projectDeadline : earliest;
    }, null as Date | null);
    
    if (!earliestDeadline) return null;
    
    const now = new Date();
    const diffTime = earliestDeadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Handle Join Group button click
  const handleJoinGroup = () => {
    navigate("/");
  };

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="animate-pulse text-green-600">Loading...</div>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Group Not Found</h1>
          <p className="text-gray-600">This group link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  const progressPercentage = calculateProgress(groupData.totalCollected, groupData.totalTarget);
  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header with Kontrib Logo */}
      <div className="bg-white border-b border-green-100">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-green-600">Kontrib</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {groupData.group.name}
            </h1>
            {groupData.group.description && (
              <p className="text-gray-600 text-sm">
                {groupData.group.description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Goal Amount */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Target Goal</span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {formatNaira(groupData.totalTarget)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-bold text-green-600">
                  {progressPercentage}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Raised: {formatNaira(groupData.totalCollected)}</span>
                <span>Remaining: {formatNaira(parseInt(groupData.totalTarget) - parseInt(groupData.totalCollected))}</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-green-600">
                  {groupData.memberCount}
                </div>
                <div className="text-xs text-gray-600">Contributors</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-blue-600">
                  {groupData.projects.length}
                </div>
                <div className="text-xs text-gray-600">Projects</div>
              </div>
            </div>

            {/* Deadline Countdown */}
            {daysRemaining !== null && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Time Remaining</span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </div>
                  <div className="text-xs text-orange-700">
                    Until first deadline
                  </div>
                </div>
              </div>
            )}

            {/* Projects Preview */}
            {groupData.projects.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 text-sm">Projects</h3>
                <div className="space-y-2">
                  {groupData.projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{project.name}</span>
                        <span className="text-sm font-bold text-green-600">
                          {formatNaira(project.targetAmount)}
                        </span>
                      </div>
                      <Progress 
                        value={calculateProgress(project.collectedAmount, project.targetAmount)} 
                        className="h-1 mt-2" 
                      />
                    </div>
                  ))}
                  {groupData.projects.length > 3 && (
                    <div className="text-center text-xs text-gray-500">
                      +{groupData.projects.length - 3} more projects
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Join Group Button */}
            <Button 
              onClick={handleJoinGroup}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold rounded-lg shadow-lg"
              data-testid="button-join-group"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Join Group
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Trust Indicators */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <div>Secure contributions with SMS verification</div>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified Group
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {groupData.memberCount} Members
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}