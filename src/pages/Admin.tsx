import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, LogOut, Edit, Settings, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { login, logout, isAuthenticated, initializeAdmin, updateCredentials } from "@/lib/auth";
import {
  getActivities,
  saveActivity,
  deleteActivity,
  updateActivity,
  type Activity,
} from "@/lib/activities";

const Admin = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    content: "",
    images: [] as string[],
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

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    updateCredentials(newUsername, newPassword);
    setNewUsername("");
    setNewPassword("");
    setShowSettings(false);
    toast.success("Identifiants mis à jour avec succès!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (editingActivity) {
          setEditingActivity({
            ...editingActivity,
            images: [...(editingActivity.images || []), base64String],
          });
        } else {
          setNewActivity((prev) => ({
            ...prev,
            images: [...prev.images, base64String],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (editingActivity) {
      const updatedImages = editingActivity.images?.filter((_, i) => i !== index);
      setEditingActivity({
        ...editingActivity,
        images: updatedImages,
      });
    } else {
      setNewActivity((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newActivity.title || !newActivity.date || !newActivity.location || !newActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    saveActivity(newActivity);
    setNewActivity({ title: "", date: "", location: "", content: "", images: [] });
    loadActivities();
    toast.success("Activité ajoutée avec succès!");
  };

  const handleUpdateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingActivity) return;

    if (!editingActivity.title || !editingActivity.date || !editingActivity.location || !editingActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    updateActivity(editingActivity.id, editingActivity);
    setEditingActivity(null);
    loadActivities();
    toast.success("Activité mise à jour avec succès!");
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      deleteActivity(id);
      loadActivities();
      toast.success("Activité supprimée");
    }
  };

  const startEditingActivity = (activity: Activity) => {
    setEditingActivity({ ...activity });
  };

  const cancelEditing = () => {
    setEditingActivity(null);
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Settings Section */}
        {showSettings && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Paramètres du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div>
                  <Label htmlFor="newUsername">Nouveau nom d'utilisateur</Label>
                  <Input
                    id="newUsername"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Nouveau nom d'utilisateur"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Mettre à jour les identifiants
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Activity Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingActivity ? (
                <>
                  <Edit className="w-5 h-5" />
                  Modifier une activité
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Ajouter une activité
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre de l'activité</Label>
                <Input
                  id="title"
                  value={editingActivity ? editingActivity.title : newActivity.title}
                  onChange={(e) =>
                    editingActivity
                      ? setEditingActivity({ ...editingActivity, title: e.target.value })
                      : setNewActivity({ ...newActivity, title: e.target.value })
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
                    value={editingActivity ? editingActivity.date : newActivity.date}
                    onChange={(e) =>
                      editingActivity
                        ? setEditingActivity({ ...editingActivity, date: e.target.value })
                        : setNewActivity({ ...newActivity, date: e.target.value })
                    }
                    placeholder="Date de l'activité"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Lieu de l'activité</Label>
                  <Input
                    id="location"
                    value={editingActivity ? editingActivity.location : newActivity.location}
                    onChange={(e) =>
                      editingActivity
                        ? setEditingActivity({ ...editingActivity, location: e.target.value })
                        : setNewActivity({ ...newActivity, location: e.target.value })
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
                  value={editingActivity ? editingActivity.content : newActivity.content}
                  onChange={(e) =>
                    editingActivity
                      ? setEditingActivity({ ...editingActivity, content: e.target.value })
                      : setNewActivity({ ...newActivity, content: e.target.value })
                  }
                  placeholder="Description détaillée de l'activité..."
                  rows={6}
                  required
                />
              </div>
              
              {/* Image Upload */}
              <div>
                <Label htmlFor="images">Images</Label>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("images")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Ajouter des images
                  </Button>
                </div>
                
                {/* Image Preview */}
                {(editingActivity ? editingActivity.images : newActivity.images)?.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {(editingActivity ? editingActivity.images : newActivity.images).map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingActivity ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Mettre à jour l'activité
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Ajouter l'activité
                    </>
                  )}
                </Button>
                {editingActivity && (
                  <Button type="button" variant="outline" onClick={cancelEditing}>
                    Annuler
                  </Button>
                )}
              </div>
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
                      {activity.images && activity.images.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {activity.images.length} image(s)
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => startEditingActivity(activity)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
