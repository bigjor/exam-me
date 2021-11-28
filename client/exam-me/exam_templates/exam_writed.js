export const exam_type = {
  MAKE_UP_TEST: "make-up-test",
  EXAM: "exam",
  TEST: "test"
}


// model en cada prequnta es obligatorio
// question en cada prequnta es obligatorio
export const exam_sheet = {
  active: true,
  title: "TEMA 2: ALGORITMIA",
  end_date: (new Date(2021, 11, 8)),
  aditional_info: {
    course: 2,
    module: "daw",
    type: exam_type.EXAM
  },
  files: [
    {
      name: "exam_sheet.pdf",
      url: "https://www.google.com",
      type: "pdf"
    }
  ], //ver como implementar esta seccion. bytes o enlaces a archivos??
  sections: {
    123: {
      id: 123,
      title: "",
      questions: [
        // Para texto con imagen / es
        {
          title: "Cual de las dos imagenes es la correcta?",
          images: [
            // {
            //   url: "string",
            //   alt: "srting"
            // }
          ],
          model: ""
        },
        // Para texto
        {
          title: "Que es la reactividad?. Explica tu respuesta",
          model: ""
        },
      ]
    }
  },
}