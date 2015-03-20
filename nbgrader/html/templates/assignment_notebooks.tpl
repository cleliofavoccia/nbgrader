{%- extends 'gradebook.tpl' -%}

{%- block breadcrumb -%}
<li><a href="../assignments">Assignments</a></li>
<li class="active">{{ assignment.name }}</li>
{%- endblock -%}

{%- block body -%}
<div class="panel-body">
  The following table lists the notebooks that are associated with the
  assignment "{{ assignment.name }}". Click on a notebook
  name to see the list of student submissions for that notebook.
</div>
{%- endblock -%}

{%- block table -%}
<thead>
  <tr>
    <th>Notebook ID</th>
    <th class="center">Avg. Score</th>
    <th class="center">Avg. Code Score</th>
    <th class="center">Avg. Written Score</th>
  </tr>
</thead>
<tbody>
  {%- for notebook in notebooks -%}
  <tr>
    <td><a href="../assignments/{{ assignment.name }}/{{ notebook.name }}">{{ notebook.name }}</a></td>
    <td class="center">{{ notebook.average_score | float | round(2) }} / {{ notebook.max_score | float | round(2) }}</td>
    <td class="center">{{ notebook.average_code_score | float | round(2) }} / {{ notebook.max_code_score | float | round(2) }}</td>
    <td class="center">{{ notebook.average_written_score | float | round(2) }} / {{ notebook.max_written_score | float | round(2) }}</td>
  </tr>
  {%- endfor -%}
</tbody>
{%- endblock -%}
