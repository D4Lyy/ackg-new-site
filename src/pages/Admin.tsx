import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, LogOut, Edit, Settings, UserPlus, Calendar as CalendarIcon, X, MoveUp, MoveDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { User, Session } from "@supabase/supabase-js";

interface Activity {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  images?: string[];
}

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    location: "",
    content: "",
    images: [] as string[],
  });
  const [activityDate, setActivityDate] = useState<Date>();
  
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPasswordChange, setNewPasswordChange] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    });

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
      const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      setIsAdmin(data === true);
    } catch (error) {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    setActivities(data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success("Connexion réussie!");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Email de réinitialisation envoyé!");
      setShowResetPassword(false);
      setResetEmail("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (editingActivity) {
          setEditingActivity({ ...editingActivity, images: [...(editingActivity.images || []), base64] });
        } else {
          setNewActivity((prev) => ({ ...prev, images: [...prev.images, base64] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    if (editingActivity) {
      const newImages = [...(editingActivity.images || [])];
      newImages.splice(index, 1);
      setEditingActivity({ ...editingActivity, images: newImages });
    } else {
      const newImages = [...newActivity.images];
      newImages.splice(index, 1);
      setNewActivity({ ...newActivity, images: newImages });
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const images = editingActivity ? (editingActivity.images || []) : newActivity.images;
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, images: newImages });
    } else {
      setNewActivity({ ...newActivity, images: newImages });
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.location || !newActivity.content) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const dateStr = activityDate ? format(activityDate, "yyyy-MM-dd") : new Date().toISOString().split('T')[0];
    const { error } = await supabase.from('activities').insert([{ ...newActivity, date: dateStr }]);
    if (error) toast.error(error.message);
    else {
      setNewActivity({ title: "", date: "", location: "", content: "", images: [] });
      setActivityDate(undefined);
      loadActivities();
      toast.success("Activité ajoutée!");
    }
  };

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    const { error } = await supabase.from('activities').update(editingActivity).eq('id', editingActivity.id);
    if (error) toast.error(error.message);
    else {
      setEditingActivity(null);
      loadActivities();
      toast.success("Activité mise à jour!");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Supprimer cette activité ?")) return;
    await supabase.from('activities').delete().eq('id', id);
    loadActivities();
    toast.success("Activité supprimée");
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: authData, error } = await supabase.auth.signUp({
      email: newUserEmail,
      password: newUserPassword,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) toast.error(error.message);
    else if (authData.user) {
      await supabase.from('user_roles').insert([{ user_id: authData.user.id, role: 'admin' }]);
      setNewUserEmail("");
      setNewUserPassword("");
      toast.success("Utilisateur admin ajouté!");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordChange !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPasswordChange });
    if (error) toast.error(error.message);
    else {
      toast.success("Mot de passe modifié!");
      setCurrentPassword("");
      setNewPasswordChange("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20">Chargement...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 pt-20">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Administration ACKG</CardTitle></CardHeader>
          <CardContent>
            {!showResetPassword ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Se connecter</Button>
                <Button type="button" variant="link" className="w-full" onClick={() => setShowResetPassword(true)}>
                  Mot de passe oublié?
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input id="resetEmail" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Réinitialiser le mot de passe</Button>
                <Button type="button" variant="link" className="w-full" onClick={() => setShowResetPassword(false)}>
                  Retour à la connexion
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Accès refusé</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-4">Vous n'avez pas les permissions nécessaires.</p>
            <Button onClick={() => navigate("/")} className="w-full">Retour à l'accueil</Button>
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
            <Button variant="outline" onClick={() => setShowPasswordChange(!showPasswordChange)}>
              <Settings className="w-4 h-4 mr-2" />Mot de passe
            </Button>
            {isAdmin && (
              <Button variant="outline" onClick={() => setShowUserManagement(!showUserManagement)}>
                <UserPlus className="w-4 h-4 mr-2" />Utilisateurs
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />Déconnexion
            </Button>
          </div>
        </div>

        {showPasswordChange && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Changer le mot de passe</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" value={newPasswordChange} onChange={(e) => setNewPasswordChange(e.target.value)} required />
                </div>
                <div>
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit">Changer le mot de passe</Button>
              </form>
            </CardContent>
          </Card>
        )}

        {showUserManagement && isAdmin && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Ajouter un utilisateur admin</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>Mot de passe</Label>
                  <Input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
                </div>
                <Button type="submit">Ajouter l'utilisateur</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader><CardTitle>{editingActivity ? "Modifier" : "Ajouter"} une activité</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity} className="space-y-4">
              <div>
                <Label>Titre</Label>
                <Input value={editingActivity?.title || newActivity.title} onChange={(e) => editingActivity ? setEditingActivity({...editingActivity, title: e.target.value}) : setNewActivity({...newActivity, title: e.target.value})} required />
              </div>
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !activityDate && !editingActivity && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editingActivity?.date || (activityDate ? format(activityDate, "PPP") : "Sélectionner une date")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={activityDate} onSelect={setActivityDate} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Lieu</Label>
                <Input value={editingActivity?.location || newActivity.location} onChange={(e) => editingActivity ? setEditingActivity({...editingActivity, location: e.target.value}) : setNewActivity({...newActivity, location: e.target.value})} required />
              </div>
              <div>
                <Label>Contenu</Label>
                <Textarea value={editingActivity?.content || newActivity.content} onChange={(e) => editingActivity ? setEditingActivity({...editingActivity, content: e.target.value}) : setNewActivity({...newActivity, content: e.target.value})} rows={6} required />
              </div>
              <div>
                <Label>Images</Label>
                <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                {(editingActivity?.images || newActivity.images).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {(editingActivity?.images || newActivity.images).map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          {idx > 0 && (
                            <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(idx, 'up')}>
                              <MoveUp className="h-4 w-4" />
                            </Button>
                          )}
                          {idx < (editingActivity?.images || newActivity.images).length - 1 && (
                            <Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveImage(idx, 'down')}>
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          )}
                          <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={() => removeImage(idx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit"><PlusCircle className="w-4 h-4 mr-2" />{editingActivity ? "Mettre à jour" : "Ajouter"}</Button>
                {editingActivity && <Button type="button" variant="outline" onClick={() => setEditingActivity(null)}>Annuler</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Activités existantes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.date} - {activity.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingActivity(activity)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
