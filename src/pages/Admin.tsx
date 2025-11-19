import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { login, logout, isAuthenticated, initializeAdmin } from "@/lib/auth";
import {
  getActivities,
  saveActivity,
  deleteActivity,
  type Activity,
} from "@/lib/activities";

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    content: "",
  });

  useEffect(() => {
    initializeAdmin();
    if (isAuthenticated()) {
      setAuthenticated(true);
      loadActivities();
    }
  }, []);

  const loadActivities = () => {
    setActivities(getActivities());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setAuthenticated(true);
      loadActivities();
      toast.success("Connexion réussie!");
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    navigate("/");
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newActivity.title || !newActivity.date || !newActivity.location || !newActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    saveActivity(newActivity);
    setNewActivity({ title: "", date: "", location: "", content: "" });
    loadActivities();
    toast.success("Activité ajoutée avec succès!");
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      deleteActivity(id);
      loadActivities();
      toast.success("Activité supprimée");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Administration ACKG</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Administration</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Add Activity Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Ajouter une activité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'activité</Label>
                <Input
                  id="title"
                  value={newActivity.title}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, title: e.target.value })
                  }
                  placeholder="Titre de l'activité"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date de l'activité</Label>
                  <Input
                    id="date"
                    value={newActivity.date}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, date: e.target.value })
                    }
                    placeholder="Date de l'activité"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Lieu de l'activité</Label>
                  <Input
                    id="location"
                    value={newActivity.location}
                    onChange={(e) =>
                      setNewActivity({ ...newActivity, location: e.target.value })
                    }
                    placeholder="Lieu de l'activité"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={newActivity.content}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, content: e.target.value })
                  }
                  placeholder="Description détaillée de l'activité..."
                  rows={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Ajouter l'activité
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle>Activités existantes ({activities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune activité pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-start gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.date} • {activity.location}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {activity.content}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
