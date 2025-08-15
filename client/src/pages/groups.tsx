import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/navigation";
import { CreateGroupModal } from "@/components/create-group-modal";
import { GroupCard } from "@/components/group-card";
import { 
  Users, 
  Plus, 
  Search,
} from "lucide-react";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { formatNaira } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

export default function Groups() {
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  const { toast } = useToast();
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch groups based on user role
  const { data: groups = [], isLoading } = useQuery<any[]>({
    queryKey: userIsAdmin ? ["/api/groups", "admin", user?.id] : ["/api/groups", "user", user?.id],
    enabled: !!user,
  });

  // Extract groups for member data structure
  const actualGroups = userIsAdmin ? groups : groups.map(membership => membership.group);

  // Filter groups based on search
  const filteredGroups = actualGroups.filter((group) =>
    group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShareGroup = (group: any) => {
    const shareUrl = `${window.location.origin}/register/${group.registrationLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Join ${group.name}`,
        text: `You're invited to contribute to ${group.name}`,
        url: shareUrl,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Group registration link copied to clipboard.",
      });
    } else {
      // Fallback: Generate WhatsApp message
      const whatsappMessage = encodeURIComponent(
        `🎯 You're invited to join our contribution group "${group.name}"!\n\n💰 Target: ${formatNaira(group.targetAmount || 0)}\n📅 Deadline: ${group.deadline ? new Date(group.deadline).toLocaleDateString() : 'No deadline'}\n\n👥 Join here: ${shareUrl}\n\n#Kontrib #GroupContribution`
      );
      window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 sm:pb-0">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {userIsAdmin ? "My Groups" : "Groups"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {userIsAdmin 
                  ? "Manage your contribution groups and track member progress."
                  : "View and contribute to your active groups."
                }
              </p>
            </div>
            {userIsAdmin && (
              <Button 
                onClick={() => setCreateGroupModalOpen(true)}
                className="mt-4 sm:mt-0 bg-nigerian-green hover:bg-forest-green"
                data-testid="create-group-button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search groups by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-groups"
              />
            </div>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              {actualGroups.length === 0 ? (
                <>
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {userIsAdmin ? "No Groups Created" : "No Groups Joined"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {userIsAdmin 
                      ? "Create your first group to start collecting contributions from members."
                      : "You haven't joined any contribution groups yet. Ask a group admin for an invitation link."
                    }
                  </p>
                  {userIsAdmin && (
                    <Button 
                      onClick={() => setCreateGroupModalOpen(true)}
                      className="bg-nigerian-green hover:bg-forest-green"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Group
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Results Found</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    No groups match your search criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              // Handle different data structures for admin vs member groups
              const userContribution = userIsAdmin ? undefined : 
                groups.find(membership => membership.group?.id === group.id)?.contributedAmount;
              
              return (
                <GroupCard
                  key={group.id}
                  group={group}
                  isAdmin={userIsAdmin}
                  onManage={userIsAdmin ? () => {} : undefined}
                  onShare={handleShareGroup}
                  onMakePayment={!userIsAdmin ? () => {} : undefined}
                  userContribution={userContribution}
                />
              );
            })}
          </div>
        )}

        {/* Quick Stats Summary */}
        {actualGroups.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-nigerian-green">
                      {actualGroups.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userIsAdmin ? "Groups Created" : "Groups Joined"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {actualGroups.reduce((sum, group) => sum + (group.memberCount || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {actualGroups.reduce((sum, group) => sum + (group.projectCount || 0), 0)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
      />
    </div>
  );
}