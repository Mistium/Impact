// Name: TurboWasm
// ID: turbowasm
// Description: Allows running WebAssembly.
// By: Procybit <https://scratch.mit.edu/users/Kyleus/>
// License: WTFPL

(function(Scratch) {
  'use strict'
  class TurboWasm {
    constructor() {
      this.modules = {}
      this.vm = Scratch.vm;
      this.runtime = this.vm.runtime;
      this.icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaGVpZ2h0PSIxMDI0IgogICB3aWR0aD0iMTAyNCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnNiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibGV0dGVycy5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNCAoODZhOGFkNywgMjAyNC0xMC0xMSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczYiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc2IgogICAgIHBhZ2Vjb2xvcj0iIzUwNTA1MCIKICAgICBib3JkZXJjb2xvcj0iI2VlZWVlZSIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjNTA1MDUwIgogICAgIGlua3NjYXBlOnpvb209IjAuMzU4Mzk4NDQiCiAgICAgaW5rc2NhcGU6Y3g9IjUxOC45NzU0OCIKICAgICBpbmtzY2FwZTpjeT0iNDMyLjQ3OTU2IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTI4MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI5NjEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9Imc3IgogICAgIHNob3dndWlkZXM9ImZhbHNlIiAvPgogIDxnCiAgICAgaWQ9Imc3IgogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEuNDI4Mjc0NywwLDAsMS40MjgyNzQ3LC0yMDAuMTQwNTUsLTEyNS4wMDIyNCkiPgogICAgPGcKICAgICAgIGlkPSJ0ZXh0NyIKICAgICAgIHN0eWxlPSJmb250LXNpemU6MzEzLjgxM3B4O2xpbmUtaGVpZ2h0OjAuODtmb250LWZhbWlseTonQmxhY2sgYm95cyBvbiBtb3BlZHMnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0JsYWNrIGJveXMgb24gbW9wZWRzJzt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWFuY2hvcjptaWRkbGU7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjEyMDtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6c3Ryb2tlIG1hcmtlcnMgZmlsbCIKICAgICAgIGFyaWEtbGFiZWw9IlcmIzEwOyAgICBBIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMS4xNTQ3ODM2LDAsMCwxLjE1NDc4MzYsLTQwLjY0NzI4NSwtNzcuNzkxNDY5KSI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Im0gNDc5LjcxMjc2LDIzNC4xNzA0MyBxIDAsMTEuNjExMDggLTE2LjYzMjA4LDEwLjY2OTY0IC0yLjUxMDUxLDAgLTguNDcyOTUsLTEuODgyODcgLTUuOTYyNDUsLTEuODgyODggLTkuNzI4MjEsLTEuNTY5MDcgMCw1LjY0ODYzIC0wLjMxMzgxLDE2Ljk0NTkgLTAuMzEzODEsNy4yMTc3IC00LjM5MzM4LDM2LjcxNjEyIGwgLTUuMzM0ODIsMzcuNjU3NTYgcSAtNC43MDcyLDM0LjIwNTYyIC0xNC4xMjE1OSw4My40NzQyNiAtMS44ODI4OCw5LjQxNDM4IC0yLjUxMDUsMTEuMjk3MjYgLTIuMTk2NjksNS4zMzQ4MiAtOC4xNTkxNCw4LjE1OTE0IGwgLTcuNTMxNTEsLTAuNjI3NjMgcSAtOC40NzI5NSwtMS4yNTUyNSAtMTEuNjExMDgsLTE0LjQzNTM5IC0wLjk0MTQ0LC00LjM5MzM4IC0zLjEzODEzLC0xMy4xODAxNSAtMy4xMzgxMywtMTAuOTgzNDUgLTEyLjU1MjUyLC00NS41MDI4OCBsIC0xNi4zMTgyOCwtNjMuMDc2NDEgcSAtMC45NDE0Myw1LjAyMTAxIC0xMC4wNDIwMSw3NC4wNTk4NiAtMS4yNTUyNSw5LjcyODIxIC01LjMzNDgyLDM3LjY1NzU2IC0xLjg4Mjg4LDExLjYxMTA4IC04Ljc4Njc3LDE1LjM3Njg0IC01Ljk2MjQ0LDEuMjU1MjUgLTE3LjI1OTcxLDMuNDUxOTQgLTIuNTEwNSwtMC45NDE0NCAtNS45NjI0NSwtNC4zOTMzOCAtMTEuOTI0ODksLTM4LjI4NTE5IC0yNi4wNDY0OCwtOTUuNzEyOTYgLTEuMjU1MjUsLTYuNTkwMDggLTUuOTYyNDQsLTI1LjQxODg1IC0zLjEzODEzLC05LjcyODIxIC0xMS45MjQ5LC0zNy42NTc1NiAtMC42Mjc2MiwtMy43NjU3NiAtMy43NjU3NSwtMTAuMzU1ODMgLTkuNDE0MzksMS41NjkwNiAtMTIuNTUyNTIsMS41NjkwNiAtOS43MjgyLDAgLTE1LjA2MzAyLC01LjY0ODYzIC0yLjE5NjcsLTIuMTk2NjkgLTIuMTk2NywtNS42NDg2MyAwLC0zLjQ1MTk1IDIuODI0MzIsLTcuNTMxNTIgMi44MjQzMiwtNC4wNzk1NiA2LjI3NjI2LC00LjcwNzE5IDguMTU5MTQsLTIuODI0MzIgMzUuMTQ3MDYsLTIuODI0MzIgOS4xMDA1NywtMS41NjkwNiAyMC4zOTc4NCwtMi41MTA1IDIwLjcxMTY2LC0xLjg4Mjg4IDIwLjcxMTY2LDEwLjM1NTgzIDAsOS43MjgyIC0yMy41MzU5OCwxMC42Njk2NCAtMS44ODI4NywwLjMxMzgxIC01LjY0ODYzLDEuMjU1MjUgLTIuNTEwNSwxLjU2OTA3IC0yLjE5NjY5LDYuOTAzODkgMC4zMTM4MSw1LjY0ODYzIDUuNjQ4NjMsMjAuMzk3ODQgMS44ODI4OCw3Ljg0NTMzIDEwLjM1NTgzLDQzLjMwNjE5IGwgMy43NjU3NiwxNS4zNzY4NCBxIDAuMzEzODEsMC42Mjc2MyAxNS4wNjMwMiw1My4wMzQzOSAwLDAuMzEzODIgMC45NDE0NCwxLjI1NTI2IDQuNzA3MTksLTE4LjIwMTE2IDguMTU5MTQsLTQ0LjU2MTQ1IGwgNS4wMjEsLTM4LjI4NTE4IHEgMC4zMTM4MiwtNC43MDcyIDEuODgyODgsLTE3LjU3MzUzIDAuOTQxNDQsLTUuNjQ4NjMgMy4xMzgxMywtMjEuNjUzMSAwLC05LjcyODIgMi4xOTY2OSwtMjguODcwNzkgMS4yNTUyNiwtNS42NDg2MyA4LjQ3Mjk1LC02LjkwMzg5IDQuNzA3MiwtMC4zMTM4MSA5LjQxNDM5LDEuNTY5MDcgNS4wMjEwMSwxLjg4Mjg4IDUuMDIxMDEsNS45NjI0NCAwLDEzLjgwNzc4IDMuNzY1NzYsMjYuOTg3OTIgMi41MTA1LDguNDcyOTUgNy41MzE1MSwyNS43MzI2NyA4Ljc4Njc2LDM1LjQ2MDg2IDIzLjUzNTk3LDkxLjk0NzIgMC4zMTM4MiwxLjg4Mjg4IDEuODgyODgsMy40NTE5NSA0LjM5MzM4LC0xNi42MzIwOSA2LjI3NjI2LC0yNy45MjkzNiA1LjY0ODYzLC0zMi45NTAzNiAxNC43NDkyMSwtMTAzLjI0NDQ3IDAuMzEzODEsLTAuNjI3NjMgLTAuMzEzODEsLTE2Ljk0NTkxIC0wLjYyNzYzLC0wLjk0MTQzIC0xLjU2OTA3LC0xLjI1NTI1IC0xMC4zNTU4MiwtMS44ODI4OCAtMTYuMzE4MjcsLTMuNDUxOTQgLTEyLjIzODcxLC0zLjEzODEzIC0xMi4yMzg3MSwtNy41MzE1MSAwLC0xLjI1NTI1IDAuOTQxNDQsLTIuODI0MzIgMy4xMzgxMywtNi45MDM4OCAxMi4yMzg3MSwtNi45MDM4OCAyLjE5NjY5LDAgMTAuMDQyMDEsMS4yNTUyNSA2LjkwMzg5LDEuMjU1MjUgOS40MTQzOSwwLjYyNzYyIDAuOTQxNDQsMCAzMS4wNjc0OSwxLjg4Mjg4IDEwLjA0MjAxLDAuNjI3NjMgMTMuODA3NzcsMS44ODI4OCA3Ljg0NTMyLDIuNTEwNSA3Ljg0NTMyLDkuNzI4MiB6IgogICAgICAgICBpZD0icGF0aDQiCiAgICAgICAgIHN0eWxlPSJmb250LXNpemU6MzEzLjgxM3B4O2xpbmUtaGVpZ2h0OjAuODtmb250LWZhbWlseTonQmxhY2sgYm95cyBvbiBtb3BlZHMnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0JsYWNrIGJveXMgb24gbW9wZWRzJzt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWFuY2hvcjptaWRkbGU7c3Ryb2tlOiNmZmZmZmY7c3Ryb2tlLXdpZHRoOjEyMDtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6c3Ryb2tlIG1hcmtlcnMgZmlsbCIgLz4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSA0NzkuNzEyNzYsMjM0LjE3MDQzIHEgMCwxMS42MTEwOCAtMTYuNjMyMDgsMTAuNjY5NjQgLTIuNTEwNTEsMCAtOC40NzI5NSwtMS44ODI4NyAtNS45NjI0NSwtMS44ODI4OCAtOS43MjgyMSwtMS41NjkwNyAwLDUuNjQ4NjMgLTAuMzEzODEsMTYuOTQ1OSAtMC4zMTM4MSw3LjIxNzcgLTQuMzkzMzgsMzYuNzE2MTIgbCAtNS4zMzQ4MiwzNy42NTc1NiBxIC00LjcwNzIsMzQuMjA1NjIgLTE0LjEyMTU5LDgzLjQ3NDI2IC0xLjg4Mjg4LDkuNDE0MzggLTIuNTEwNSwxMS4yOTcyNiAtMi4xOTY2OSw1LjMzNDgyIC04LjE1OTE0LDguMTU5MTQgbCAtNy41MzE1MSwtMC42Mjc2MyBxIC04LjQ3Mjk1LC0xLjI1NTI1IC0xMS42MTEwOCwtMTQuNDM1MzkgLTAuOTQxNDQsLTQuMzkzMzggLTMuMTM4MTMsLTEzLjE4MDE1IC0zLjEzODEzLC0xMC45ODM0NSAtMTIuNTUyNTIsLTQ1LjUwMjg4IGwgLTE2LjMxODI4LC02My4wNzY0MSBxIC0wLjk0MTQzLDUuMDIxMDEgLTEwLjA0MjAxLDc0LjA1OTg2IC0xLjI1NTI1LDkuNzI4MjEgLTUuMzM0ODIsMzcuNjU3NTYgLTEuODgyODgsMTEuNjExMDggLTguNzg2NzcsMTUuMzc2ODQgLTUuOTYyNDQsMS4yNTUyNSAtMTcuMjU5NzEsMy40NTE5NCAtMi41MTA1LC0wLjk0MTQ0IC01Ljk2MjQ1LC00LjM5MzM4IC0xMS45MjQ4OSwtMzguMjg1MTkgLTI2LjA0NjQ4LC05NS43MTI5NiAtMS4yNTUyNSwtNi41OTAwOCAtNS45NjI0NCwtMjUuNDE4ODUgLTMuMTM4MTMsLTkuNzI4MjEgLTExLjkyNDksLTM3LjY1NzU2IC0wLjYyNzYyLC0zLjc2NTc2IC0zLjc2NTc1LC0xMC4zNTU4MyAtOS40MTQzOSwxLjU2OTA2IC0xMi41NTI1MiwxLjU2OTA2IC05LjcyODIsMCAtMTUuMDYzMDIsLTUuNjQ4NjMgLTIuMTk2NywtMi4xOTY2OSAtMi4xOTY3LC01LjY0ODYzIDAsLTMuNDUxOTUgMi44MjQzMiwtNy41MzE1MiAyLjgyNDMyLC00LjA3OTU2IDYuMjc2MjYsLTQuNzA3MTkgOC4xNTkxNCwtMi44MjQzMiAzNS4xNDcwNiwtMi44MjQzMiA5LjEwMDU3LC0xLjU2OTA2IDIwLjM5Nzg0LC0yLjUxMDUgMjAuNzExNjYsLTEuODgyODggMjAuNzExNjYsMTAuMzU1ODMgMCw5LjcyODIgLTIzLjUzNTk4LDEwLjY2OTY0IC0xLjg4Mjg3LDAuMzEzODEgLTUuNjQ4NjMsMS4yNTUyNSAtMi41MTA1LDEuNTY5MDcgLTIuMTk2NjksNi45MDM4OSAwLjMxMzgxLDUuNjQ4NjMgNS42NDg2MywyMC4zOTc4NCAxLjg4Mjg4LDcuODQ1MzMgMTAuMzU1ODMsNDMuMzA2MTkgbCAzLjc2NTc2LDE1LjM3Njg0IHEgMC4zMTM4MSwwLjYyNzYzIDE1LjA2MzAyLDUzLjAzNDM5IDAsMC4zMTM4MiAwLjk0MTQ0LDEuMjU1MjYgNC43MDcxOSwtMTguMjAxMTYgOC4xNTkxNCwtNDQuNTYxNDUgbCA1LjAyMSwtMzguMjg1MTggcSAwLjMxMzgyLC00LjcwNzIgMS44ODI4OCwtMTcuNTczNTMgMC45NDE0NCwtNS42NDg2MyAzLjEzODEzLC0yMS42NTMxIDAsLTkuNzI4MiAyLjE5NjY5LC0yOC44NzA3OSAxLjI1NTI2LC01LjY0ODYzIDguNDcyOTUsLTYuOTAzODkgNC43MDcyLC0wLjMxMzgxIDkuNDE0MzksMS41NjkwNyA1LjAyMTAxLDEuODgyODggNS4wMjEwMSw1Ljk2MjQ0IDAsMTMuODA3NzggMy43NjU3NiwyNi45ODc5MiAyLjUxMDUsOC40NzI5NSA3LjUzMTUxLDI1LjczMjY3IDguNzg2NzYsMzUuNDYwODYgMjMuNTM1OTcsOTEuOTQ3MiAwLjMxMzgyLDEuODgyODggMS44ODI4OCwzLjQ1MTk1IDQuMzkzMzgsLTE2LjYzMjA5IDYuMjc2MjYsLTI3LjkyOTM2IDUuNjQ4NjMsLTMyLjk1MDM2IDE0Ljc0OTIxLC0xMDMuMjQ0NDcgMC4zMTM4MSwtMC42Mjc2MyAtMC4zMTM4MSwtMTYuOTQ1OTEgLTAuNjI3NjMsLTAuOTQxNDMgLTEuNTY5MDcsLTEuMjU1MjUgLTEwLjM1NTgyLC0xLjg4Mjg4IC0xNi4zMTgyNywtMy40NTE5NCAtMTIuMjM4NzEsLTMuMTM4MTMgLTEyLjIzODcxLC03LjUzMTUxIDAsLTEuMjU1MjUgMC45NDE0NCwtMi44MjQzMiAzLjEzODEzLC02LjkwMzg4IDEyLjIzODcxLC02LjkwMzg4IDIuMTk2NjksMCAxMC4wNDIwMSwxLjI1NTI1IDYuOTAzODksMS4yNTUyNSA5LjQxNDM5LDAuNjI3NjIgMC45NDE0NCwwIDMxLjA2NzQ5LDEuODgyODggMTAuMDQyMDEsMC42Mjc2MyAxMy44MDc3NywxLjg4Mjg4IDcuODQ1MzIsMi41MTA1IDcuODQ1MzIsOS43MjgyIHoiCiAgICAgICAgIGlkPSJwYXRoNiIKICAgICAgICAgc3R5bGU9ImZvbnQtc2l6ZTozMTMuODEzcHg7bGluZS1oZWlnaHQ6MC44O2ZvbnQtZmFtaWx5OidCbGFjayBib3lzIG9uIG1vcGVkcyc7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQmxhY2sgYm95cyBvbiBtb3BlZHMnO3RleHQtYWxpZ246Y2VudGVyO3RleHQtYW5jaG9yOm1pZGRsZTtmaWxsOiNmZmZmZmY7c3Ryb2tlOiM2NTRlZjA7c3Ryb2tlLXdpZHRoOjU1O3N0cm9rZS1saW5lam9pbjpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgbWFya2VycyBmaWxsIiAvPgogICAgPC9nPgogICAgPGcKICAgICAgIGlkPSJ0ZXh0NSIKICAgICAgIHN0eWxlPSJmb250LXNpemU6MzEzLjgxM3B4O2xpbmUtaGVpZ2h0OjAuODtmb250LWZhbWlseTonQmxhY2sgYm95cyBvbiBtb3BlZHMnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0JsYWNrIGJveXMgb24gbW9wZWRzJzt0ZXh0LWFsaWduOmNlbnRlcjt0ZXh0LWFuY2hvcjptaWRkbGU7ZmlsbDojZmZmZmZmO3N0cm9rZTojNjU0ZWYwO3N0cm9rZS13aWR0aDo1NTtzdHJva2UtbGluZWpvaW46cm91bmQ7cGFpbnQtb3JkZXI6c3Ryb2tlIG1hcmtlcnMgZmlsbCIKICAgICAgIGFyaWEtbGFiZWw9IlcmIzEwOyAgICBBIgogICAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMS4xNTYxOTYzLDAsMCwxLjE1NjE5NjMsLTExMi4yODE0LC02MS42MzU3MTEpIj4KICAgICAgPHBhdGgKICAgICAgICAgZD0ibSA3NDkuNzQ4NzIsNjQ2LjgzNDUyIHEgLTIxLjk2NjkxLDkuMTAwNTcgLTQwLjc5NTY5LDIzLjUzNTk3IC0zLjQ1MTk0LDIuNTEwNSAtMTIuMjM4NywyLjgyNDMyIC0yLjgyNDMyLDAgLTUuMzM0ODIsLTIuMTk2NjkgLTIuNTEwNTEsLTIuMTk2NyAtMi41MTA1MSwtNS4wMjEwMSAwLC00LjA3OTU3IDguNDcyOTUsLTkuNzI4MiAzLjQ1MTk1LC0yLjE5NjcgMTEuOTI0OSwtNy44NDUzMyAwLjMxMzgxLC0xLjU2OTA2IC0xMC4zNTU4MywtMzcuMDI5OTMgLTE2LjYzMjA5LC0wLjMxMzgyIC01NC4yODk2NSwxMS4yOTcyNyAtMi4xOTY2OSwwLjYyNzYyIC0zLjQ1MTk0LDguNzg2NzYgLTAuNjI3NjMsMC45NDE0NCAtMS4yNTUyNSwyLjgyNDMyIDAsMC45NDE0MyAzLjc2NTc1LDIuODI0MzEgNC4wNzk1NywxLjg4Mjg4IDQuNzA3MiwyLjgyNDMyIDAuNjI3NjIsMC45NDE0NCAwLjYyNzYyLDIuODI0MzIgMCw0LjM5MzM4IC0zLjQ1MTk0LDcuNTMxNTEgLTMuNDUxOTQsMi44MjQzMiAtNy44NDUzMywyLjgyNDMyIC0xLjI1NTI1LC0wLjMxMzgyIC0xMS4yOTcyNiwtMS41NjkwNyAtNS4wMjEwMSwtMC42Mjc2MyAtMjguNTU2OTksLTIuNTEwNSAtMTkuNDU2NCwtMS41NjkwNyAtMTkuNDU2NCwtOC43ODY3NyAwLC03LjUzMTUxIDcuNTMxNTEsLTguNzg2NzYgNC4wNzk1NywtMC42Mjc2MyAxMS4yOTcyNywwLjYyNzYzIDEuNTY5MDYsMC42Mjc2MiAyNC43OTEyMiwyLjE5NjY5IDEuODgyODgsLTE1LjY5MDY1IDYuMjc2MjYsLTM2LjcxNjEyIDUuNjQ4NjQsLTI2LjA0NjQ4IDIwLjM5Nzg1LC05Ny45MDk2NiAtMy4xMzgxMywtMC42Mjc2MiAtNi41OTAwNywtMC42Mjc2MiAtNS45NjI0NSwwIC0xNy41NzM1MywzLjQ1MTk0IC0xMS42MTEwOCwzLjQ1MTk0IC0xNy41NzM1MywzLjQ1MTk0IC0yLjE5NjY5LDAgLTYuMjc2MjYsLTMuNDUxOTQgLTAuMzEzODEsLTEuMjU1MjUgLTAuMzEzODEsLTIuMTk2NjkgMCwtNi41OTAwNyA4Ljc4Njc2LC04LjE1OTE0IDI0Ljc5MTIzLC00LjcwNzE5IDQzLjkzMzgyLC01Ljk2MjQ0IGwgOS40MTQzOSwtMC42Mjc2MyBxIDcuODQ1MzMsMC45NDE0NCAxMi41NTI1MiwxOC41MTQ5NyAxLjg4Mjg4LDYuNTkwMDcgNy44NDUzMiwyMi4yODA3MiAzLjc2NTc2LDkuNzI4MiAxMy4xODAxNSwzMi45NTAzNiBsIDE0LjEyMTU4LDMyLjMyMjc0IHEgNC4wNzk1NywxMC4wNDIwMiAxNy44ODczNSw0NS44MTY3IDQuMDc5NTYsLTAuNjI3NjMgMTMuNDkzOTUsLTUuMzM0ODIgOS40MTQzOSwtNC43MDcyIDEyLjg2NjM0LC00LjcwNzIgMy43NjU3NSwwIDcuMjE3NjksMi44MjQzMiAwLjk0MTQ0LDAuOTQxNDQgMS41NjkwNyw0LjcwNzE5IDAuMzEzODEsNS42NDg2NCAtNC4wNzk1Nyw4LjE1OTE0IC0xLjU2OTA2LDAuNjI3NjMgLTkuNDE0MzksMy43NjU3NiB6IG0gLTU3LjExMzk2LC01MS43NzkxNSBxIC00LjM5MzM4LC04Ljc4Njc2IC0xMy40OTM5NiwtMzEuMzgxMyAtMS41NjkwNywtMy43NjU3NSAtMTYuOTQ1OSwtMzcuNjU3NTYgbCAtMTUuNjkwNjUsNzkuMDgwODggcSAyOC4yNDMxNywtNS4zMzQ4MiA0NC4yNDc2MywtOC4xNTkxNCAxLjg4Mjg4LC0xLjI1NTI1IDEuODgyODgsLTEuODgyODggeiIKICAgICAgICAgaWQ9InBhdGg1IgogICAgICAgICBzdHlsZT0iZm9udC1zaXplOjMxMy44MTNweDtsaW5lLWhlaWdodDowLjg7Zm9udC1mYW1pbHk6J0JsYWNrIGJveXMgb24gbW9wZWRzJzstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOidCbGFjayBib3lzIG9uIG1vcGVkcyc7dGV4dC1hbGlnbjpjZW50ZXI7dGV4dC1hbmNob3I6bWlkZGxlO3N0cm9rZTojZmZmZmZmO3N0cm9rZS13aWR0aDoxMjA7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3BhaW50LW9yZGVyOnN0cm9rZSBtYXJrZXJzIGZpbGwiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Im0gNzQ5Ljc0ODcyLDY0Ni44MzQ1MiBxIC0yMS45NjY5MSw5LjEwMDU3IC00MC43OTU2OSwyMy41MzU5NyAtMy40NTE5NCwyLjUxMDUgLTEyLjIzODcsMi44MjQzMiAtMi44MjQzMiwwIC01LjMzNDgyLC0yLjE5NjY5IC0yLjUxMDUxLC0yLjE5NjcgLTIuNTEwNTEsLTUuMDIxMDEgMCwtNC4wNzk1NyA4LjQ3Mjk1LC05LjcyODIgMy40NTE5NSwtMi4xOTY3IDExLjkyNDksLTcuODQ1MzMgMC4zMTM4MSwtMS41NjkwNiAtMTAuMzU1ODMsLTM3LjAyOTkzIC0xNi42MzIwOSwtMC4zMTM4MiAtNTQuMjg5NjUsMTEuMjk3MjcgLTIuMTk2NjksMC42Mjc2MiAtMy40NTE5NCw4Ljc4Njc2IC0wLjYyNzYzLDAuOTQxNDQgLTEuMjU1MjUsMi44MjQzMiAwLDAuOTQxNDMgMy43NjU3NSwyLjgyNDMxIDQuMDc5NTcsMS44ODI4OCA0LjcwNzIsMi44MjQzMiAwLjYyNzYyLDAuOTQxNDQgMC42Mjc2MiwyLjgyNDMyIDAsNC4zOTMzOCAtMy40NTE5NCw3LjUzMTUxIC0zLjQ1MTk0LDIuODI0MzIgLTcuODQ1MzMsMi44MjQzMiAtMS4yNTUyNSwtMC4zMTM4MiAtMTEuMjk3MjYsLTEuNTY5MDcgLTUuMDIxMDEsLTAuNjI3NjMgLTI4LjU1Njk5LC0yLjUxMDUgLTE5LjQ1NjQsLTEuNTY5MDcgLTE5LjQ1NjQsLTguNzg2NzcgMCwtNy41MzE1MSA3LjUzMTUxLC04Ljc4Njc2IDQuMDc5NTcsLTAuNjI3NjMgMTEuMjk3MjcsMC42Mjc2MyAxLjU2OTA2LDAuNjI3NjIgMjQuNzkxMjIsMi4xOTY2OSAxLjg4Mjg4LC0xNS42OTA2NSA2LjI3NjI2LC0zNi43MTYxMiA1LjY0ODY0LC0yNi4wNDY0OCAyMC4zOTc4NSwtOTcuOTA5NjYgLTMuMTM4MTMsLTAuNjI3NjIgLTYuNTkwMDcsLTAuNjI3NjIgLTUuOTYyNDUsMCAtMTcuNTczNTMsMy40NTE5NCAtMTEuNjExMDgsMy40NTE5NCAtMTcuNTczNTMsMy40NTE5NCAtMi4xOTY2OSwwIC02LjI3NjI2LC0zLjQ1MTk0IC0wLjMxMzgxLC0xLjI1NTI1IC0wLjMxMzgxLC0yLjE5NjY5IDAsLTYuNTkwMDcgOC43ODY3NiwtOC4xNTkxNCAyNC43OTEyMywtNC43MDcxOSA0My45MzM4MiwtNS45NjI0NCBsIDkuNDE0MzksLTAuNjI3NjMgcSA3Ljg0NTMzLDAuOTQxNDQgMTIuNTUyNTIsMTguNTE0OTcgMS44ODI4OCw2LjU5MDA3IDcuODQ1MzIsMjIuMjgwNzIgMy43NjU3Niw5LjcyODIgMTMuMTgwMTUsMzIuOTUwMzYgbCAxNC4xMjE1OCwzMi4zMjI3NCBxIDQuMDc5NTcsMTAuMDQyMDIgMTcuODg3MzUsNDUuODE2NyA0LjA3OTU2LC0wLjYyNzYzIDEzLjQ5Mzk1LC01LjMzNDgyIDkuNDE0MzksLTQuNzA3MiAxMi44NjYzNCwtNC43MDcyIDMuNzY1NzUsMCA3LjIxNzY5LDIuODI0MzIgMC45NDE0NCwwLjk0MTQ0IDEuNTY5MDcsNC43MDcxOSAwLjMxMzgxLDUuNjQ4NjQgLTQuMDc5NTcsOC4xNTkxNCAtMS41NjkwNiwwLjYyNzYzIC05LjQxNDM5LDMuNzY1NzYgeiBtIC01Ny4xMTM5NiwtNTEuNzc5MTUgcSAtNC4zOTMzOCwtOC43ODY3NiAtMTMuNDkzOTYsLTMxLjM4MTMgLTEuNTY5MDcsLTMuNzY1NzUgLTE2Ljk0NTksLTM3LjY1NzU2IGwgLTE1LjY5MDY1LDc5LjA4MDg4IHEgMjguMjQzMTcsLTUuMzM0ODIgNDQuMjQ3NjMsLTguMTU5MTQgMS44ODI4OCwtMS4yNTUyNSAxLjg4Mjg4LC0xLjg4Mjg4IHoiCiAgICAgICAgIGlkPSJwYXRoNyIgLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=';
    }
    getInfo() {
      return {
        id: 'turbowasm',
        name: 'TurboWasm',
        color1: "#624dea",
        menuIconURI: this.icon,
        blockIconURI: this.icon,
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'WebAssembly Modules'
          },
          {
            opcode: 'instantiateWasm',
            blockType: Scratch.BlockType.COMMAND,
            text: 'instantiate .wasm URL [url] as [name]',
            arguments: {
              url: {
                type: Scratch.ArgumentType.STRING
              },
              name: {
                type: Scratch.ArgumentType.STRING
              }
            }
          },
          {
            opcode: 'unloadWasm',
            blockType: Scratch.BlockType.COMMAND,
            text: 'unload .wasm [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING
              }
            }
          },
          {
            opcode: 'allWasms',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all .wasm instances'
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Calling Functions'
          },
          {
            opcode: 'allFunctions',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all functions in [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          "---",
          {
            opcode: 'procedure',
            blockType: Scratch.BlockType.COMMAND,
            text: '[func]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              }
            }
          },
          {
            opcode: 'moduleCall0',
            blockType: Scratch.BlockType.REPORTER,
            text: 'call [func] in [name]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              }
            }
          },
          {
            opcode: 'moduleCall1',
            blockType: Scratch.BlockType.REPORTER,
            text: 'call [func] in [name] with [a1]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              a1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              }
            }
          },
          {
            opcode: 'moduleCall2',
            blockType: Scratch.BlockType.REPORTER,
            text: 'call [func] in [name] with [a1] [a2]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              a1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              }
            }
          },
          {
            opcode: 'moduleCall3',
            blockType: Scratch.BlockType.REPORTER,
            text: 'call [func] in [name] with [a1] [a2] [a3]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              a1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              }
            }
          },
          {
            opcode: 'moduleCall4',
            blockType: Scratch.BlockType.REPORTER,
            text: 'call [func] in [name] with [a1] [a2] [a3] [a4]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              a1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              }
            }
          },
          {
            opcode: 'moduleCall16',
            blockType: Scratch.BlockType.REPORTER,
            text: 'call [func] in [name] with [a1] [a2] [a3] [a4] [a5] [a6] [a7] [a8] [a9] [a10] [a11] [a12] [a13] [a14] [a15] [a16]',
            arguments: {
              func: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              a1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a2: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a3: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a4: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a5: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a6: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a7: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a8: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a9: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a10: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a11: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a12: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a13: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a14: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a15: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              },
              a16: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: ""
              }
            }
          },

          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Array Loading'
          },
          {
            opcode: 'malloc',
            blockType: Scratch.BlockType.REPORTER,
            text: 'malloc [size] bytes in [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING
              },
              size: {
                type: Scratch.ArgumentType.NUMBER
              }
            }
          },
          {
            opcode: 'free',
            blockType: Scratch.BlockType.COMMAND,
            text: 'free [ptr] in [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING
              },
              ptr: {
                type: Scratch.ArgumentType.NUMBER
              }
            }
          },
          "---",
          {
            opcode: 'place',
            blockType: Scratch.BlockType.COMMAND,
            text: 'place array [list] at [ptr] in [name] type [size]',
            arguments: {
              list: {
                type: Scratch.ArgumentType.STRING,
                menu: "lists"
              },
              ptr: {
                type: Scratch.ArgumentType.NUMBER
              },
              name: {
                type: Scratch.ArgumentType.STRING
              },
              size: {
                type: Scratch.ArgumentType.STRING,
                menu: "sizes"
              }
            }
          },
          {
            opcode: 'take',
            blockType: Scratch.BlockType.COMMAND,
            text: 'take array at [ptr] in [name] type [size] to [list] length [length]',
            arguments: {
              ptr: {
                type: Scratch.ArgumentType.NUMBER
              },
              name: {
                type: Scratch.ArgumentType.STRING
              },
              size: {
                type: Scratch.ArgumentType.STRING,
                menu: "sizes"
              },
              list: {
                type: Scratch.ArgumentType.STRING,
                menu: "lists"
              },
              length: {
                type: Scratch.ArgumentType.NUMBER
              }
            }
          },
        ],
        menus: {
          sizes: {
            acceptReporters: true,
            items: ["i8", "i16", "i32", "i64",
                    "u8", "u16", "u32", "u64",
                    "f32", "f64"]
          },
          lists: {
            acceptReporters: true,
            items: "_getLists",
          }
        }
      };
    }
    instantiateWasm({ url, name }) {
      fetch(url).then(response =>
        response.arrayBuffer()
      ).then(bytes =>
        WebAssembly.instantiate(bytes, {env:{}})
      ).then(results => {
        this.modules[name] = results.instance.exports
      });
    }
    unloadWasm({ name }) {
      if (name in this.modules) {
        delete this.modules[name]
      }
    }
    allWasms({}) {
      return JSON.stringify(Object.keys(this.modules))
    }
    allFunctions({ name }) {
      if (name in this.modules) {
        var funcs = [];
        for (const [k, v] of Object.entries(this.modules[name])) {
          if (v instanceof Function) {
            funcs.push(k);
          }
        }
        return JSON.stringify(funcs);
      }
      return;
    }
    procedure({ func }) {}
    moduleCall0({ func, name}) {
      if (name in this.modules) {
        if (func in this.modules[name]) {
          return this.modules[name][func]();
        }
      }
      return;
    }
    moduleCall1({ func, name, a1 }) {
      if (name in this.modules) {
        if (func in this.modules[name]) {
          return this.modules[name][func](a1);
        }
      }
      return;
    }
    moduleCall2({ func, name, a1, a2 }) {
      if (name in this.modules) {
        if (func in this.modules[name]) {
          return this.modules[name][func](a1, a2);
        }
      }
      return;
    }
    moduleCall3({ func, name, a1, a2, a3 }) {
      if (name in this.modules) {
        if (func in this.modules[name]) {
          return this.modules[name][func](a1, a2, a3);
        }
      }
      return;
    }
    moduleCall4({ func, name, a1, a2, a3, a4 }) {
      if (name in this.modules) {
        if (func in this.modules[name]) {
          return this.modules[name][func](a1, a2, a3, a4);
        }
      }
      return;
    }
    moduleCall16({ func, name, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16 }) {
      if (name in this.modules) {
        if (func in this.modules[name]) {
          return this.modules[name][func](a1, a2, a3, a4, a5, a6, a7 , a8 , a9 , a10, a11, a12, a13, a14, a15, a16);
        }
      }
      return;
    }
    malloc({ size, name }) {
      if (name in this.modules) {
        if ('_malloc' in this.modules[name]) {
          return this.modules[name]._malloc(size);
        }
      }
      return;
    }
    free({ name, ptr }) {
      if (name in this.modules) {
        if ('_free' in this.modules[name]) {
          return this.modules[name]._free(ptr);
        }
      }
      return;
    }
    place({ list, ptr, name, size }, util) {
      const v = this.getVarObjectFromName(list, util, "list");
      if (!v) {return;};
      const array = this.getVarObjectFromName(list, util, "list").value;
      if (!array) {return;};
      if (!(name in this.modules)) {return;};
      if (!('memory' in this.modules[name]));
      const memory = this.modules[name].memory;
      const buffer = memory.buffer;

      switch (size) {
        case "i8":
          new Int8Array(buffer, ptr, array.length).set(array);
          break;
        case "i16":
          new Int16Array(buffer, ptr, array.length).set(array);
          break;
        case "i32":
          new Int32Array(buffer, ptr, array.length).set(array);
          break;
        case "i64":
          const bigIntArray = new BigInt64Array(buffer, ptr, array.length);
          for (let i = 0; i < array.length; i++) {
              bigIntArray[i] = array[i];
          }
          break;
        case "u8":
          new Uint8Array(buffer, ptr, array.length).set(array);
          break;
        case "u16":
          new Uint16Array(buffer, ptr, array.length).set(array);
          break;
        case "u32":
          new Uint32Array(buffer, ptr, array.length).set(array);
          break;
        case "u64":
          const bigUintArray = new BigUint64Array(buffer, ptr, array.length);
          for (let i = 0; i < array.length; i++) {
              bigUintArray[i] = array[i];
          }
          break;
        case "f32":
          new Float32Array(buffer, ptr, array.length).set(array);
          break;
        case "f64":
          new Float64Array(buffer, ptr, array.length).set(array);
          break;
        default:
          throw new Error(`Unsupported size: ${size}`);
      }
    }
    take({ ptr, name, size, list, length }, util) {
      const v = this.getVarObjectFromName(list, util, "list");
      if (!v) {return;};
      const array = this.getVarObjectFromName(list, util, "list").value;
      if (!array) {return;};
      if (!(name in this.modules)) {return;};
      if (!('memory' in this.modules[name]));
      const memory = this.modules[name].memory;
      const buffer = memory.buffer;

      if (array.length < length) {
        array.length = length;
      }

      var new_array;
      switch (size) {
        case "i8":
          new_array = new Int8Array(buffer, ptr, length);
          break;
        case "i16":
          new_array = new Int16Array(buffer, ptr, length);
          break;
        case "i32":
          new_array = new Int32Array(buffer, ptr, length);
          break;
        case "i64":
          new_array = new BigInt64Array(buffer, ptr, length);
          break;
        case "u8":
          new_array = new Uint8Array(buffer, ptr, length);
          break;
        case "u16":
          new_array = new Uint16Array(buffer, ptr, length);
          break;
        case "u32":
          new_array = new Uint32Array(buffer, ptr, length);
          break;
        case "u64":
          new_array = new BigUint64Array(buffer, ptr, length);
          break;
        case "f32":
          new_array = new Float32Array(buffer, ptr, length);
          break;
        case "f64":
          new_array = new Float64Array(buffer, ptr, length);
          break;
        default:
          throw new Error(`Unsupported size: ${size}`);
      }

      for (let i = 0; i < length; i++) {
          array[i] = new_array[i];
      }
    }
    // Lily's code from ListTools.js
    _getLists() {
      const lists =
        typeof Blockly === "undefined"
          ? []
          : Blockly.getMainWorkspace()
              .getVariableMap()
              .getVariablesOfType("list")
              .map((model) => model.name);
      if (lists.length > 0) {
        return lists;
      } else {
        return [""];
      }
    }
    getVarObjectFromName(name, util, type) {
      const stageTarget = this.runtime.getTargetForStage();
      const target = util.target;
      let listObject = Object.create(null);

      listObject = stageTarget.lookupVariableByNameAndType(name, type);
      if (listObject) return listObject;
      listObject = target.lookupVariableByNameAndType(name, type);
      if (listObject) return listObject;
    };
  }
  Scratch.extensions.register(new TurboWasm());
})(Scratch);
