function Footer() {
  return (
    <>
      <footer>
        <p>Just a shared footer component chillin'.</p>
      </footer>

      <style jsx>{`

        footer {
          border-top: 1px solid black;
          width: 100%;
          padding: 5px 10px;
          text-align: center;
        }
      `}
      </style>
    </>
  );
}

export default Footer;
