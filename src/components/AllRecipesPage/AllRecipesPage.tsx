import { uniq } from "lodash";
import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";
import { ColorScheme } from "../../ColorScheme";
import recipeData from "../../data-recipes.json";
import userData from "../../data-users.json";
import { Styles } from "../../Styles";
import CategoryBar from "../CategoryBar/CategoryBar";
import RecipeCard, { BlankRecipeCard } from "./RecipeCard";

const { accentColorOne, primaryColorTwo, primaryColorOne } = ColorScheme;
const { secondaryFont, mobileMaxWidth } = Styles;

const RVSCont = styled.div`
  width: 95%;
  gap: 5px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${primaryColorOne};
  padding: 5px 0;
`;

interface RVSProps {
  bgColor: string | null;
  textColor: string | null;
}

const RViewSelector = styled.div<RVSProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 35px;
  border: 1px solid lightgrey;
  font-family: ${secondaryFont};
  text-align: center;
  cursor: pointer;
  color: ${(props) => props.textColor};
  background-color: ${(props) => props.bgColor};
  @media (max-width: ${mobileMaxWidth}) {
    font-size: 10px;
    padding: 0;
  } ;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 5px 0;
  @media (max-width: ${mobileMaxWidth}) {
    box-shadow: none;
  }
`;

const Recipes = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: ${mobileMaxWidth}) {
    width: 100%;
  }
`;

export function handleRecipeArrayLength(allRecipes: JSX.Element[]) {
  if (window.screen.width < 500) {
    return allRecipes;
  } else {
    if (allRecipes.length > 4 && allRecipes.length % 4 !== 0) {
      do {
        let key = allRecipes.length;
        allRecipes.push(BlankRecipeCard(key));
      } while (allRecipes.length % 4 !== 0);
    } else if (allRecipes.length < 4) {
      do {
        let key = allRecipes.length;
        allRecipes.push(BlankRecipeCard(key));
      } while (allRecipes.length <= 3);
    }
    return allRecipes;
  }
}

interface Recipe {
  recipeId: number;
  createdBy: string;
  name: string;
  category: string;
  servings: number;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: { number: number; instruction: string }[];
}

interface IState {
  categories: string[];
  categoryPage: number;
  categoryToShow: string;
  recipesToShow: string;
}

class AllRecipesPage extends Component<
  RouteComponentProps<{ id: string }>,
  IState
> {
  constructor(props: RouteComponentProps<{ id: string }>) {
    super(props);
    this.state = {
      categories: ["ALL"],
      categoryPage: 0,
      categoryToShow: "ALL",
      recipesToShow: "ALL RECIPES",
    };
    this.changeCategoryToShow = this.changeCategoryToShow.bind(this);
  }

  changeCategoryToShow(categoryToShow: string) {
    this.setState({ categoryToShow });
  }

  filterRecipesByCat() {
    let recipesByCat =
      this.state.categoryToShow === "ALL"
        ? recipeData
        : recipeData.filter((r) => r.category === this.state.categoryToShow);
    return recipesByCat;
  }

  renderPublicRecipes() {
    const allRecipes = this.filterRecipesByCat().map((recipeData, index) => {
      const { recipeId, name, createdBy } = recipeData;
      const RCProps = {
        name,
        recipeId,
        index,
        uid: this.props.match.params.id,
        createdBy,
      };
      return <RecipeCard key={index} {...RCProps} />;
    });
    return handleRecipeArrayLength(allRecipes);
  }

  renderUserRecipes(recipesToShow: string) {
    const recipesByCat = this.filterRecipesByCat();
    let recipes: Recipe[] = [];
    const uid = this.props.match.params.id;
    const user = userData.filter((u) => u.uid === uid);
    if (user.length) {
      const userFavs = user[0].favorites;
      if (recipesToShow === "PERSONAL RECIPES") {
        recipes = recipesByCat.filter(
          (r) => r.createdBy === this.props.match.params.id,
        );
      } else if (recipesToShow === "FAVORITE RECIPES") {
        for (let x = 0; x < userFavs.length; x++) {
          for (let y = 0; y < recipesByCat.length; y++) {
            if (recipesByCat[y].recipeId === userFavs[x]) {
              recipes.push(recipesByCat[y]);
            }
          }
        }
      }
      const userRecipes = recipes.map((recipeData, index) => {
        const { recipeId, name, createdBy } = recipeData;
        const RCProps = {
          name,
          recipeId,
          index,
          uid: this.props.match.params.id,
          createdBy,
        };
        return <RecipeCard key={index} {...RCProps} />;
      });
      return handleRecipeArrayLength(userRecipes);
    } else {
      return "NO FAVORITES YET";
    }
  }

  handleRecipes() {
    const { recipesToShow } = this.state;
    if (recipesToShow === "ALL RECIPES") {
      return this.renderPublicRecipes();
    } else {
      return this.renderUserRecipes(recipesToShow);
    }
  }

  handleRViewSelector(type: string) {
    return (
      <RViewSelector
        onClick={() => this.setState({ recipesToShow: type })}
        bgColor={this.state.recipesToShow === type ? accentColorOne : "white"}
        textColor={this.state.recipesToShow === type ? primaryColorTwo : null}>
        <div>{type}</div>
      </RViewSelector>
    );
  }

  componentDidMount() {
    const categoriesFromRecipes = uniq(recipeData.map((r) => r.category));
    const categories = ["ALL", ...categoriesFromRecipes];
    this.setState({ categories });
  }

  render() {
    return (
      <div id="AllRecipesPage">
        <CategoryBar
          categories={this.state.categories}
          categoryToShow={this.state.categoryToShow}
          changeCategoryToShow={this.changeCategoryToShow}></CategoryBar>
        <Recipes id="Recipes">
          {this.props.match.params.id ? (
            <>
              <RVSCont>
                {this.handleRViewSelector("ALL RECIPES")}
                {this.handleRViewSelector("FAVORITE RECIPES")}
                {this.handleRViewSelector("PERSONAL RECIPES")}
              </RVSCont>
              <SectionContainer>{this.handleRecipes()}</SectionContainer>
            </>
          ) : (
            this.renderPublicRecipes()
          )}
        </Recipes>
      </div>
    );
  }
}

export default withRouter(AllRecipesPage);
