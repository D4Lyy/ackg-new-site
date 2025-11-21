import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, LogOut, Edit, Settings, Upload, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  image?: string;
  images?: string[];
}

interface Profile {
  id: string;
  username: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Activities
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    content: "",
    images: [] as string[],
  });
  
  // User management
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [users, setUsers] = useState<Profile[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
            loadActivities();
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
        loadActivities();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data === true);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error("Erreur lors du chargement des activités");
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error("Erreur lors du chargement des utilisateurs");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Connexion réussie!");
    } catch (error: any) {
      toast.error(error.message || "Identifiants incorrects");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate("/");
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

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newActivity.title || !newActivity.date || !newActivity.location || !newActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const { error } = await supabase
        .from('activities')
        .insert([{
          title: newActivity.title,
          date: newActivity.date,
          location: newActivity.location,
          content: newActivity.content,
          images: newActivity.images.length > 0 ? newActivity.images : null,
        }]);

      if (error) throw error;

      setNewActivity({ title: "", date: "", location: "", content: "", images: [] });
      loadActivities();
      toast.success("Activité ajoutée avec succès!");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout de l'activité");
    }
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingActivity) return;

    if (!editingActivity.title || !editingActivity.date || !editingActivity.location || !editingActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const { error } = await supabase
        .from('activities')
        .update({
          title: editingActivity.title,
          date: editingActivity.date,
          location: editingActivity.location,
          content: editingActivity.content,
          images: editingActivity.images,
        })
        .eq('id', editingActivity.id);

      if (error) throw error;

      setEditingActivity(null);
      loadActivities();
      toast.success("Activité mise à jour avec succès!");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour de l'activité");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadActivities();
      toast.success("Activité supprimée");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression de l'activité");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail || !newUserPassword || !newUserUsername) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      // Create user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            username: newUserUsername,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: authData.user.id,
            role: 'admin',
          }]);

        if (roleError) throw roleError;
      }

      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserUsername("");
      loadUsers();
      toast.success("Utilisateur admin ajouté avec succès!");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout de l'utilisateur");
    }
  };

  const startEditingActivity = (activity: Activity) => {
    setEditingActivity({ ...activity });
  };

  const cancelEditing = () => {
    setEditingActivity(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Administration ACKG</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas les permissions pour accéder à cette page.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Retour à l'accueil
            </Button>
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
            <Button variant="outline" onClick={() => {
              setShowUserManagement(!showUserManagement);
              if (!showUserManagement) loadUsers();
            }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Utilisateurs
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* User Management Section */}
        {showUserManagement && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="newUserEmail">Email</Label>
                  <Input
                    id="newUserEmail"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newUserUsername">Nom d'utilisateur</Label>
                  <Input
                    id="newUserUsername"
                    type="text"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newUserPassword">Mot de passe</Label>
                  <Input
                    id="newUserPassword"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Mot de passe (min. 6 caractères)"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter un administrateur
                </Button>
              </form>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Utilisateurs existants</h3>
                {users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Aucun utilisateur
                  </p>
                ) : (
                  <div className="space-y-2">
                    {users.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium">{profile.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Créé le {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
