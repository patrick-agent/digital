"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Eye, Globe, LayoutDashboard, Navigation, Palette, PanelBottom, Plus, Save, Trash2 } from "lucide-react"
import { mergeSiteSettings } from "@/lib/site-defaults"

const tabs = [
  { id: "branding", label: "Branding", icon: Globe },
  { id: "homepage", label: "Homepage", icon: LayoutDashboard },
  { id: "navigation", label: "Navigation", icon: Navigation },
  { id: "footer", label: "Footer", icon: PanelBottom },
  { id: "theme", label: "Theme", icon: Palette },
]

const inputClass = "w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-purple/20"
const labelClass = "mb-2 block text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-text-secondary"

function Card({ title, description, children }) {
  return (
    <section className="admin-card space-y-6 p-6 lg:p-7">
      <div>
        <h2>{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-text-muted">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function TextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  )
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className={`${inputClass} resize-y`}
      />
    </div>
  )
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-border bg-admin-bg px-4 py-3 text-sm font-semibold text-text-secondary">
      <span className="leading-6">{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-accent-purple"
      />
    </label>
  )
}

function LinkEditor({ title, items, onChange, onAdd, onRemove, showId = false }) {
  return (
    <div className="space-y-3" style={{ paddingLeft: 16, paddingRight: 16 }}>
      <div className="flex items-center justify-between gap-4">
        <h3>{title}</h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-admin-bg px-3 py-2 text-xs font-bold text-text-secondary hover:text-accent-purple"
        >
          <Plus size={14} /> Add link
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="rounded-xl border border-border bg-admin-bg p-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <TextField label="Label" value={item.label} onChange={(value) => onChange(index, "label", value)} />
              </div>
              <div className={showId ? "lg:col-span-4" : "lg:col-span-6"}>
                <TextField label="Href" value={item.href} onChange={(value) => onChange(index, "href", value)} />
              </div>
              {showId && (
                <div className="lg:col-span-2">
                  <TextField label="Section ID" value={item.id} onChange={(value) => onChange(index, "id", value)} />
                </div>
              )}
              <div className="flex items-end gap-3 lg:col-span-3">
                <label className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-white text-sm font-semibold text-text-secondary">
                  <input
                    type="checkbox"
                    checked={item.enabled !== false}
                    onChange={(event) => onChange(index, "enabled", event.target.checked)}
                    className="accent-accent-purple"
                  />
                  Enabled
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-400/20 text-red-400 hover:bg-red-400/10"
                  aria-label="Remove link"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WebsiteBuilderClient({ settings }) {
  const [activeTab, setActiveTab] = useState("branding")
  const [form, setForm] = useState(() => mergeSiteSettings(settings))
  const [saving, setSaving] = useState(false)

  const updateTopLevel = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))
  const updateObject = (group, field, value) => setForm((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }))
  const updateHero = (field, value) => setForm((prev) => ({
    ...prev,
    homepage: { ...prev.homepage, hero: { ...prev.homepage.hero, [field]: value } },
  }))
  const updateSectionVisibility = (field, value) => setForm((prev) => ({
    ...prev,
    homepage: {
      ...prev.homepage,
      sectionVisibility: { ...prev.homepage.sectionVisibility, [field]: value },
    },
  }))
  const updateLink = (group, index, field, value) => setForm((prev) => ({
    ...prev,
    [group]: prev[group].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  }))
  const removeLink = (group, index) => setForm((prev) => ({
    ...prev,
    [group]: prev[group].filter((_, itemIndex) => itemIndex !== index),
  }))
  const addLink = (group, defaults = {}) => setForm((prev) => ({
    ...prev,
    [group]: [...prev[group], { label: "New Link", href: "#", enabled: true, ...defaults }],
  }))
  const updateFooterLink = (group, index, field, value) => setForm((prev) => ({
    ...prev,
    footer: {
      ...prev.footer,
      [group]: prev.footer[group].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
    },
  }))
  const removeFooterLink = (group, index) => setForm((prev) => ({
    ...prev,
    footer: { ...prev.footer, [group]: prev.footer[group].filter((_, itemIndex) => itemIndex !== index) },
  }))
  const addFooterLink = (group) => setForm((prev) => ({
    ...prev,
    footer: { ...prev.footer, [group]: [...prev.footer[group], { label: "New Link", href: "#", enabled: true }] },
  }))
  const updateParagraph = (index, value) => setForm((prev) => ({
    ...prev,
    footer: {
      ...prev.footer,
      paragraphs: prev.footer.paragraphs.map((item, itemIndex) => itemIndex === index ? value : item),
    },
  }))

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to save website settings")
      const saved = await res.json()
      setForm(mergeSiteSettings(saved))
      toast.success("Website settings saved")
    } catch (error) {
      toast.error(error?.message || "Unable to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="admin-card flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-purple">ngx-admin inspired</p>
          <h1 className="mt-2">Website Builder</h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">Tùy chỉnh website từ một giao diện admin, không cần sửa code.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-admin-card px-4 py-2.5 text-sm font-bold text-text-secondary hover:text-accent-purple"
          >
            <Eye size={16} /> Preview site
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-purple px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-purple/90 disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Website"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="admin-card p-3 xl:sticky xl:top-24 xl:self-start">
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${
                    activeTab === tab.id
                      ? "bg-sidebar-active text-accent-purple shadow-[inset_3px_0_0_var(--color-accent-purple)]"
                      : "text-text-secondary hover:bg-sidebar-hover hover:text-text-primary"
                  }`}
                >
                  <Icon size={18} /> {tab.label}
                </button>
              )
            })}
          </div>
        </aside>

        <div className="space-y-6">
          {activeTab === "branding" && (
            <>
              <Card title="Brand Identity" description="Logo, tên hiển thị và CTA chính trên navbar.">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <TextField label="Site Title" value={form.siteTitle} onChange={(value) => updateTopLevel("siteTitle", value)} />
                  <TextField label="Logo URL" value={form.branding.logoUrl} onChange={(value) => updateObject("branding", "logoUrl", value)} />
                  <TextField label="Brand Name" value={form.branding.siteName} onChange={(value) => updateObject("branding", "siteName", value)} />
                  <TextField label="Brand Subtitle" value={form.branding.siteSubtitle} onChange={(value) => updateObject("branding", "siteSubtitle", value)} />
                  <TextField label="Navbar CTA Label" value={form.branding.navCtaLabel} onChange={(value) => updateObject("branding", "navCtaLabel", value)} />
                  <TextField label="Navbar CTA Href" value={form.branding.navCtaHref} onChange={(value) => updateObject("branding", "navCtaHref", value)} />
                </div>
              </Card>
              <Card title="Social Links" description="Các link này được dùng ở footer và có thể tái sử dụng cho các section khác.">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {Object.entries(form.socialLinks).map(([key, value]) => (
                    <TextField key={key} label={key} value={value} onChange={(next) => updateObject("socialLinks", key, next)} />
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === "homepage" && (
            <>
              <Card title="Hero Section" description="Nội dung chính đầu trang homepage.">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <TextField label="Kicker" value={form.homepage.hero.kicker} onChange={(value) => updateHero("kicker", value)} />
                  <TextField label="CTA Href" value={form.homepage.hero.primaryCtaHref} onChange={(value) => updateHero("primaryCtaHref", value)} />
                  <TextField label="Title Prefix" value={form.homepage.hero.titlePrefix} onChange={(value) => updateHero("titlePrefix", value)} />
                  <TextField label="Title Accent" value={form.homepage.hero.titleAccent} onChange={(value) => updateHero("titleAccent", value)} />
                  <TextField label="Title Suffix" value={form.homepage.hero.titleSuffix} onChange={(value) => updateHero("titleSuffix", value)} />
                  <TextField label="CTA Label" value={form.homepage.hero.primaryCtaLabel} onChange={(value) => updateHero("primaryCtaLabel", value)} />
                </div>
                <TextArea label="Description" value={form.homepage.hero.description} onChange={(value) => updateHero("description", value)} />
                <TextField label="Scroll Hint" value={form.homepage.hero.scrollHint} onChange={(value) => updateHero("scrollHint", value)} />
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <ToggleField label="Enable hero background effects" checked={form.homepage.hero.effectsEnabled} onChange={(value) => updateHero("effectsEnabled", value)} />
                  <ToggleField label="Enable 3D character" checked={form.homepage.hero.characterEnabled} onChange={(value) => updateHero("characterEnabled", value)} />
                </div>
              </Card>
              <Card title="Homepage Sections" description="Bật/tắt các section chính trên homepage.">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(form.homepage.sectionVisibility).map(([key, value]) => (
                    <ToggleField key={key} label={key} checked={value} onChange={(next) => updateSectionVisibility(key, next)} />
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === "navigation" && (
            <Card title="Main Navigation" description="Điều chỉnh menu chính xuất hiện ở navbar.">
              <LinkEditor
                title="Navbar Links"
                items={form.navigation}
                showId
                onChange={(index, field, value) => updateLink("navigation", index, field, value)}
                onAdd={() => addLink("navigation", { id: "custom" })}
                onRemove={(index) => removeLink("navigation", index)}
              />
            </Card>
          )}

          {activeTab === "footer" && (
            <>
              <Card title="Footer Brand" description="Nội dung mô tả thương hiệu ở footer.">
                <TextField label="Footer Brand Name" value={form.footer.brandName} onChange={(value) => updateObject("footer", "brandName", value)} />
                {form.footer.paragraphs.map((paragraph, index) => (
                  <TextArea key={index} label={`Paragraph ${index + 1}`} value={paragraph} onChange={(value) => updateParagraph(index, value)} rows={4} />
                ))}
                <TextField label="Copyright Name" value={form.footer.copyrightName} onChange={(value) => updateObject("footer", "copyrightName", value)} />
              </Card>
              <Card title="Footer Links">
                <LinkEditor
                  title="Navigation Column"
                  items={form.footer.navigationLinks}
                  onChange={(index, field, value) => updateFooterLink("navigationLinks", index, field, value)}
                  onAdd={() => addFooterLink("navigationLinks")}
                  onRemove={(index) => removeFooterLink("navigationLinks", index)}
                />
                <LinkEditor
                  title="Others Column"
                  items={form.footer.otherLinks}
                  onChange={(index, field, value) => updateFooterLink("otherLinks", index, field, value)}
                  onAdd={() => addFooterLink("otherLinks")}
                  onRemove={(index) => removeFooterLink("otherLinks", index)}
                />
              </Card>
            </>
          )}

          {activeTab === "theme" && (
            <Card title="Theme & Admin Style" description="Nền tảng cấu hình theme để mở rộng ở các phase sau.">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TextField label="Theme Preset" value={form.theme.preset} onChange={(value) => updateObject("theme", "preset", value)} />
                <TextField label="Admin Density" value={form.theme.adminDensity} onChange={(value) => updateObject("theme", "adminDensity", value)} />
                <TextField label="Primary Color" type="color" value={form.theme.primaryColor} onChange={(value) => updateObject("theme", "primaryColor", value)} />
                <TextField label="Secondary Color" type="color" value={form.theme.secondaryColor} onChange={(value) => updateObject("theme", "secondaryColor", value)} />
                <TextField label="Accent Color" type="color" value={form.theme.accentColor} onChange={(value) => updateObject("theme", "accentColor", value)} />
              </div>
              <div className="rounded-xl border border-border bg-admin-bg p-4 text-sm text-text-muted">
                Media Library đã có trang riêng trong sidebar. Bạn có thể upload ảnh trước, copy URL rồi dán vào Logo URL hoặc các form nội dung.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
