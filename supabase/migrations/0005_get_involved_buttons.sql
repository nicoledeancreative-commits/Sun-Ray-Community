-- Makes the three "Get Involved" buttons on the Homepage editable
-- (label + optional custom link) from /admin/content.
insert into public.site_content (key, value) values
  ('homepage_get_involved_buttons', '[
    {"label": "Become a Volunteer", "href": ""},
    {"label": "Make a Donation", "href": ""},
    {"label": "View Upcoming Events", "href": ""}
  ]')
on conflict (key) do nothing;
